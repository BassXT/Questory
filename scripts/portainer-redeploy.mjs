import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const ENV_PATH = process.env.QUESTORY_PORTAINER_ENV ?? '.env.local';

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${filePath}. Create it locally with Portainer credentials.`);
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        return [line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim()];
      })
  );
}

function requireValue(env, key) {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing ${key} in ${ENV_PATH}.`);
  }

  return value;
}

function toBoolean(value, defaultValue) {
  if (value == null || value === '') {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function createRequest(baseUrl, apiKey, skipTlsVerify) {
  const base = new URL(baseUrl);
  const transport = base.protocol === 'https:' ? https : http;
  const agent =
    base.protocol === 'https:'
      ? new https.Agent({ rejectUnauthorized: !skipTlsVerify })
      : new http.Agent();

  return async function request(pathname, options = {}) {
    const url = new URL(pathname, base);
    const body = options.body == null ? undefined : JSON.stringify(options.body);

    return new Promise((resolve, reject) => {
      const request = transport.request(
        url,
        {
          agent,
          method: options.method ?? 'GET',
          headers: {
            'X-API-Key': apiKey,
            ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {})
          }
        },
        (response) => {
          const chunks = [];

          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            const contentType = response.headers['content-type'] ?? '';
            const data =
              contentType.includes('application/json') && text
                ? JSON.parse(text)
                : text;

            if (response.statusCode < 200 || response.statusCode >= 300) {
              const message = typeof data === 'string' ? data : JSON.stringify(data);
              reject(new Error(`${options.method ?? 'GET'} ${pathname} failed: ${response.statusCode} ${message}`));
              return;
            }

            resolve(data);
          });
        }
      );

      request.on('error', reject);

      if (body) {
        request.write(body);
      }

      request.end();
    });
  };
}

function findStack(stacks, stackName, preferredEndpointId) {
  const byName = stacks.filter((stack) => stack.Name === stackName);

  if (byName.length === 0) {
    throw new Error(`Portainer stack "${stackName}" was not found.`);
  }

  const preferred = preferredEndpointId
    ? byName.find((stack) => Number(stack.EndpointId) === Number(preferredEndpointId))
    : undefined;

  if (preferred) {
    return preferred;
  }

  if (byName.length === 1) {
    return byName[0];
  }

  throw new Error(
    `Multiple stacks named "${stackName}" found. Set PORTAINER_ENDPOINT_ID to the correct Portainer endpoint.`
  );
}

function redactEnv(envEntries) {
  return envEntries.map((entry) => {
    const name = entry.name ?? entry.Name ?? '';
    const value = entry.value ?? entry.Value ?? '';
    const secretLike = /password|secret|token|key/i.test(name);

    return { name, value: secretLike ? '[redacted]' : value };
  });
}

async function main() {
  const env = parseEnvFile(path.resolve(process.cwd(), ENV_PATH));
  const request = createRequest(
    requireValue(env, 'PORTAINER_URL').replace(/\/$/, ''),
    requireValue(env, 'PORTAINER_API_KEY'),
    toBoolean(env.PORTAINER_SKIP_TLS_VERIFY, false)
  );

  const stackName = requireValue(env, 'PORTAINER_STACK_NAME');
  const stacks = await request('/api/stacks');
  const stack = findStack(stacks, stackName, env.PORTAINER_ENDPOINT_ID);
  const stackDetails = await request(`/api/stacks/${stack.Id}?endpointId=${stack.EndpointId}`);
  const stackEnv = Array.isArray(stackDetails.Env) ? stackDetails.Env : [];

  const payload = {
    env: stackEnv,
    prune: toBoolean(env.PORTAINER_PRUNE, false),
    pullImage: toBoolean(env.PORTAINER_PULL_IMAGE, true),
    repositoryAuthentication: Boolean(stackDetails.GitConfig?.Authentication),
    repositoryReferenceName: stackDetails.GitConfig?.ReferenceName ?? '',
    repositoryUsername: env.PORTAINER_REPOSITORY_USERNAME ?? '',
    repositoryPassword: env.PORTAINER_REPOSITORY_TOKEN ?? '',
    repositoryGitCredentialID: Number(env.PORTAINER_REPOSITORY_GIT_CREDENTIAL_ID ?? 0)
  };

  await request(`/api/stacks/${stack.Id}/git/redeploy?endpointId=${stack.EndpointId}`, {
    method: 'PUT',
    body: payload
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        stack: {
          id: stack.Id,
          name: stack.Name,
          endpointId: stack.EndpointId,
          entryPoint: stackDetails.EntryPoint,
          gitConfig: {
            url: stackDetails.GitConfig?.URL,
            referenceName: stackDetails.GitConfig?.ReferenceName,
            configFilePath: stackDetails.GitConfig?.ConfigFilePath
          },
          env: redactEnv(stackEnv)
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
