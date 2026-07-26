import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  FrontSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ModelStyle = 'adventurer' | 'casual';
type AvatarSegment = 'head' | 'body' | 'legs' | 'feet';

interface AvatarSelection {
  backpack: boolean;
  body: ModelStyle;
  feet: ModelStyle;
  head: ModelStyle;
  legs: ModelStyle;
}

interface LoadedModel {
  key: ModelStyle;
  gltf: GLTF;
}

interface Avatar3dLabDialogProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_SELECTION: AvatarSelection = {
  backpack: true,
  body: 'adventurer',
  feet: 'adventurer',
  head: 'casual',
  legs: 'casual'
};

const MODEL_URLS: Record<ModelStyle, string> = {
  adventurer: '/avatar-3d-lab/quaternius-adventurer.gltf',
  casual: '/avatar-3d-lab/quaternius-casual.gltf'
};

const MODEL_LABELS: Record<ModelStyle, string> = {
  adventurer: 'Abenteuer',
  casual: 'Freizeit'
};

const SEGMENT_LABELS: Record<AvatarSegment, string> = {
  head: 'Kopf & Haare',
  body: 'Oberteil',
  legs: 'Hose',
  feet: 'Schuhe'
};

export function Avatar3dLabDialog({ open, onClose }: Avatar3dLabDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selection, setSelection] = useState<AvatarSelection>(DEFAULT_SELECTION);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { overflow: 'hidden' } } }}
    >
      <DialogTitle
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
          py: 1.5
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          <ViewInArRoundedIcon color="primary" />
          <Typography component="span" sx={{ fontSize: '1.1rem', fontWeight: 900 }} noWrap>
            3D-Avatar-Labor
          </Typography>
        </Stack>
        <IconButton aria-label="3D-Avatar-Labor schließen" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Avatar3dStage selection={selection} />

        <Box sx={{ borderTop: 1, borderColor: 'divider', p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, minmax(0, 1fr))' }
            }}
          >
            {(Object.keys(SEGMENT_LABELS) as AvatarSegment[]).map((segment) => (
              <FormControl fullWidth key={segment} size="small">
                <InputLabel id={`avatar-3d-${segment}-label`}>{SEGMENT_LABELS[segment]}</InputLabel>
                <Select
                  label={SEGMENT_LABELS[segment]}
                  labelId={`avatar-3d-${segment}-label`}
                  onChange={(event) =>
                    setSelection((current) => ({
                      ...current,
                      [segment]: event.target.value as ModelStyle
                    }))
                  }
                  value={selection[segment]}
                >
                  {(Object.keys(MODEL_LABELS) as ModelStyle[]).map((model) => (
                    <MenuItem key={model} value={model}>
                      {MODEL_LABELS[model]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', mt: 2 }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography component="label" htmlFor="avatar-3d-backpack" sx={{ fontWeight: 800 }}>
                Rucksack
              </Typography>
              <Switch
                checked={selection.backpack}
                id="avatar-3d-backpack"
                onChange={(event) =>
                  setSelection((current) => ({ ...current, backpack: event.target.checked }))
                }
              />
            </Stack>
            <Button
              onClick={() => setSelection(DEFAULT_SELECTION)}
              startIcon={<RestartAltRoundedIcon />}
              variant="outlined"
            >
              Zurücksetzen
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function Avatar3dStage({ selection }: { selection: AvatarSelection }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedModelsRef = useRef<LoadedModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let disposed = false;
    let frameId = 0;
    const scene = new Scene();
    scene.background = new Color('#dff4e8');

    const camera = new PerspectiveCamera(32, 1, 0.01, 100);
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      canvas,
      preserveDrawingBuffer: true
    });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const stage = new Group();
    scene.add(stage);

    const ambient = new AmbientLight('#fff8ea', 2.2);
    const keyLight = new DirectionalLight('#fff4dc', 4.5);
    keyLight.castShadow = true;
    keyLight.position.set(4, 7, 6);
    const fillLight = new DirectionalLight('#b8dcff', 2.4);
    fillLight.position.set(-5, 4, 3);
    scene.add(ambient, keyLight, fillLight);

    const floor = new Mesh(
      new PlaneGeometry(30, 30),
      new MeshStandardMaterial({ color: '#afd9bd', roughness: 0.92 })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.maxAzimuthAngle = Math.PI / 3;
    controls.minAzimuthAngle = -Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minPolarAngle = Math.PI / 3.2;

    const loader = new GLTFLoader();
    const mixers: AnimationMixer[] = [];
    let previousFrameTime = performance.now();
    const resizeObserver = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width === 0 || height === 0) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(canvas);

    Promise.all(
      (Object.keys(MODEL_URLS) as ModelStyle[]).map(async (key) => ({
        key,
        gltf: await loader.loadAsync(MODEL_URLS[key])
      }))
    )
      .then((models) => {
        if (disposed) {
          return;
        }

        models.forEach((model) => {
          prepareModel(model.gltf.scene);
          stage.add(model.gltf.scene);

          const idleClip =
            model.gltf.animations.find((clip) => clip.name === 'Idle_Neutral') ??
            model.gltf.animations.find((clip) => clip.name === 'Idle') ??
            model.gltf.animations[0];

          if (idleClip) {
            const mixer = new AnimationMixer(model.gltf.scene);
            mixer.clipAction(idleClip).play();
            mixers.push(mixer);
          }
        });

        loadedModelsRef.current = models;
        updateVisibleSegments(models, selection);
        frameAvatar(stage, camera, controls, floor);
        setLoading(false);
      })
      .catch(() => {
        if (!disposed) {
          setError('Das lokale 3D-Modell konnte nicht geladen werden.');
          setLoading(false);
        }
      });

    function animate(frameTime: number) {
      const delta = Math.min((frameTime - previousFrameTime) / 1000, 0.05);
      previousFrameTime = frameTime;
      mixers.forEach((mixer) => mixer.update(delta));
      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    }
    frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      loadedModelsRef.current = [];
      scene.traverse((object) => {
        if (!(object instanceof Mesh)) {
          return;
        }

        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    updateVisibleSegments(loadedModelsRef.current, selection);
  }, [selection]);

  return (
    <Box
      sx={{
        height: { xs: '54svh', sm: 560 },
        minHeight: { xs: 340, sm: 480 },
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
      }}
    >
      <canvas
        aria-label="Drehbare Vorschau des 3D-Avatars"
        data-testid="avatar-3d-canvas"
        ref={canvasRef}
        style={{ display: 'block', height: '100%', touchAction: 'none', width: '100%' }}
      />
      {loading ? (
        <LinearProgress
          aria-label="3D-Avatar wird geladen"
          sx={{ left: 0, position: 'absolute', right: 0, top: 0 }}
        />
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ left: 16, position: 'absolute', right: 16, top: 16 }}>
          {error}
        </Alert>
      ) : null}
    </Box>
  );
}

function prepareModel(root: Group) {
  root.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      material.side = FrontSide;
      material.needsUpdate = true;
    });
  });
}

function updateVisibleSegments(models: LoadedModel[], selection: AvatarSelection) {
  models.forEach((model) => {
    model.gltf.scene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      const segment = resolveSegmentFromHierarchy(object);

      if (segment === 'backpack') {
        object.visible = selection.backpack && model.key === 'adventurer';
        return;
      }

      object.visible = segment ? selection[segment] === model.key : false;
    });
  });
}

function resolveSegmentFromHierarchy(object: Mesh): AvatarSegment | 'backpack' | null {
  let current: Object3D | null = object;

  while (current) {
    const segment = resolveSegment(current.name);
    if (segment) {
      return segment;
    }
    current = current.parent;
  }

  return null;
}

function resolveSegment(name: string): AvatarSegment | 'backpack' | null {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('backpack')) {
    return 'backpack';
  }
  if (normalizedName.endsWith('_head')) {
    return 'head';
  }
  if (normalizedName.endsWith('_body')) {
    return 'body';
  }
  if (normalizedName.endsWith('_legs')) {
    return 'legs';
  }
  if (normalizedName.endsWith('_feet')) {
    return 'feet';
  }

  return null;
}

function frameAvatar(stage: Group, camera: PerspectiveCamera, controls: OrbitControls, floor: Mesh) {
  stage.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(stage);
  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());

  stage.position.set(-center.x, -bounds.min.y, -center.z);
  floor.position.y = 0;
  stage.updateMatrixWorld(true);

  const characterHeight = Math.max(size.y, 1);
  const targetHeight = characterHeight * 0.46;
  controls.target.set(0, targetHeight, 0);
  camera.position.set(characterHeight * 0.72, targetHeight, characterHeight * 1.85);
  camera.near = characterHeight / 100;
  camera.far = characterHeight * 20;
  camera.updateProjectionMatrix();
  controls.minDistance = characterHeight * 1.15;
  controls.maxDistance = characterHeight * 2.8;
  controls.update();
}
