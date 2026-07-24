UPDATE "AvatarItem"
SET
    "name" = trim(
        regexp_replace(
            regexp_replace("name", 'Pixel-', '', 'gi'),
            '(^|[[:space:]])Pixel([[:space:]]|$)',
            '\1\2',
            'gi'
        )
    ),
    "description" = trim(
        regexp_replace(
            replace(
                replace(
                    replace(
                        replace(COALESCE("description", ''), '8-Bit-Abenteuerlook', 'Abenteuerlook'),
                        'Pixelstil',
                        'Abenteuerstil'
                    ),
                    'Pixelhaarschnitt',
                    'Haarschnitt'
                ),
                'Pixelmuetze',
                'Muetze'
            ),
            '(^|[[:space:]-])Pixel([[:space:]-]|$)',
            '\1\2',
            'gi'
        )
    ),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE
    "name" ~* 'Pixel'
    OR COALESCE("description", '') ~* 'Pixel|8-Bit';
