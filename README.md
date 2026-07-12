# Patitas & Horno — venta y entrega automática

Landing React con Checkout Pro de Mercado Pago, correo automático, PDF de muestra y área privada ligera para entregar videos y PDFs sin una plataforma de alumnos.

## Flujo

1. El comprador escribe nombre y correo en la landing.
2. El servidor crea una preferencia y lo dirige a Mercado Pago.
3. Mercado Pago devuelve al comprador a éxito, pendiente o error.
4. El Webhook consulta el pago directamente en Mercado Pago.
5. Si el pago es `approved`, por $55 MXN y corresponde al producto, se crea un enlace privado firmado.
6. Resend envía el enlace al correo del comprador.
7. La página de éxito vuelve a verificar el pago y también muestra el acceso.

Nunca se entrega el curso basándose solamente en los parámetros de la URL.

## Archivos del contenido

- PDF público de prueba: `public/vista-previa-ebook.pdf`
- PDFs y videos de pago: `private/course/`

La zona privada detecta automáticamente `.pdf`, `.mp4`, `.webm` y `.mov`. Puedes ordenar los archivos agregando números al nombre:

```text
private/course/
  01-bienvenida.mp4
  02-recetario-completo.pdf
  03-galletas-caninas.mp4
  04-guia-de-snacks.pdf
```

No coloques el material completo dentro de `public` ni `src`, porque quedaría accesible públicamente.

## Configuración local

```bash
npm install
Copy-Item .env.example .env
npm run build
npm start
```

Para trabajar en la interfaz con recarga automática usa dos terminales:

```bash
npm run dev:server
npm run dev
```

Vite abre el frontend en `http://localhost:5173` y envía `/api` al servidor en `http://localhost:3000`.

## Variables privadas

Configura estas variables en `.env` para desarrollo y en Railway para producción:

```env
APP_URL=https://tu-proyecto.up.railway.app
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
MERCADO_PAGO_WEBHOOK_SECRET=...
ACCESS_LINK_SECRET=una-cadena-larga-y-aleatoria
RESEND_API_KEY=re_...
EMAIL_FROM=Patitas & Horno <cursos@tudominio.com>
PRODUCT_PRICE=55
PRODUCT_CURRENCY=MXN
```

`ACCESS_LINK_SECRET` debe ser una cadena aleatoria de al menos 32 caracteres. No expongas ninguna de estas variables con el prefijo `VITE_`.

## Mercado Pago

1. En Mercado Pago Developers crea una aplicación de Checkout Pro.
2. Copia el Access Token de producción en `MERCADO_PAGO_ACCESS_TOKEN`.
3. Publica primero el proyecto para obtener una URL HTTPS.
4. En **Tus integraciones → Webhooks → Configurar notificaciones**, registra:

```text
https://TU-DOMINIO/api/webhooks/mercadopago
```

5. Selecciona el evento **Pagos**.
6. Copia la firma secreta generada en `MERCADO_PAGO_WEBHOOK_SECRET`.
7. Usa el simulador de Webhooks y después realiza una compra de prueba completa.

La preferencia configura automáticamente estas rutas:

- Éxito: `/gracias`
- Pendiente: `/pago-pendiente`
- Error: `/pago-error`

## Correo con Resend

1. Crea una cuenta en Resend.
2. Verifica el dominio desde el que enviarás correos.
3. Crea una API key y guárdala en `RESEND_API_KEY`.
4. Usa una dirección del dominio verificado en `EMAIL_FROM`.

Si Resend todavía no está configurado, el pago puede verificarse y la página de éxito muestra el enlace, pero el correo no se enviará.

## Railway

1. Sube el proyecto a GitHub y crea un servicio desde ese repositorio.
2. Railway detectará Node y ejecutará `npm start`.
3. Build command: `npm run build`.
4. Agrega todas las variables de `.env.example`.
5. Genera un dominio público y úsalo en `APP_URL`.
6. Para conservar el registro de correos enviados entre despliegues, monta un Volume en `/app/data` y configura `DATA_DIR=/app/data`.
7. Si subes el material directamente al Volume, monta otro en `/app/private/course` y configura `COURSE_FILES_DIR=/app/private/course`. Si los archivos están versionados en un repositorio privado, no es necesario.

## Cloudflare R2 — recomendado para el curso

Si configuras R2, el sistema deja de leer `private/course` y carga el contenido desde el bucket automáticamente.

1. En Cloudflare abre **Storage & databases → R2 object storage**.
2. Presiona **Create bucket**.
3. Nombre: `curso-reposteria-canina`.
4. Storage class: **Standard**.
5. Dentro del bucket crea la carpeta `course` y sube allí tus archivos numerados.
6. Regresa a **R2 → Overview → Manage in API Tokens**.
7. Presiona **Create Account API token**.
8. Permiso: **Object Read & Write**.
9. Limita el token únicamente al bucket `curso-reposteria-canina`.
10. Copia `Access Key ID`, `Secret Access Key` y el endpoint S3. El secreto se muestra una sola vez.

Agrega en Railway:

```env
R2_ENDPOINT=https://TU_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=curso-reposteria-canina
R2_COURSE_PREFIX=course/
R2_URL_EXPIRES_SECONDS=3600
```

Los archivos deben verse así en R2:

```text
course/01-bienvenida.mp4
course/02-recetario-completo.pdf
course/03-galletas-caninas.mp4
```

El bucket debe permanecer privado. El servidor genera enlaces de reproducción y descarga que vencen automáticamente. No necesitas activar `r2.dev` ni hacer público el bucket.

## Seguridad y límites

- El enlace está firmado y tiene una vigencia configurable con `ACCESS_LINK_DAYS`.
- El servidor comprueba estado, monto, moneda y referencia del pago.
- Los archivos completos no son estáticos: pasan por una ruta que valida el token.
- Un comprador todavía puede compartir su enlace o grabar el contenido. Sin cuentas de usuario no existe una protección absoluta; este diseño prioriza simplicidad y automatización.
- Guarda copias de seguridad de tus PDFs y videos fuera de Railway.

## Comprobaciones

```bash
npm run build
npm start
```

Estado del servidor:

```text
GET /api/health
```

## Usar este proyecto como plantilla para otro producto

La versión estable anterior a esta preparación está guardada en el tag de Git `antes-de-plantilla`. La landing publicada no cambia hasta que hagas `git push` y Railway despliegue ese commit.

Para crear otro producto sin perder este:

1. En GitHub crea un repositorio nuevo a partir de este proyecto (o duplica la carpeta local y cambia el remoto).
2. Edita `src/product-config.js`. Ahí están marca, textos, precio visual, preguntas, módulos, imágenes y PDF de muestra.
3. Sustituye el ebook dentro de `src/assets`, el PDF dentro de `public` y el video promocional dentro de `src`.
4. Crea otro servicio en Railway conectado al repositorio nuevo. No reutilices el mismo servicio del producto actual.
5. Copia las variables necesarias y cambia al menos:

```env
APP_URL=https://URL-DEL-NUEVO-SERVICIO
PRODUCT_NAME=Nombre del nuevo producto
PRODUCT_ID=identificador-del-nuevo-producto
PRODUCT_REFERENCE_PREFIX=prefijo-unico
PRODUCT_PRICE=55
PRODUCT_CURRENCY=MXN
R2_BUCKET=tu-bucket
R2_COURSE_PREFIX=carpeta-del-producto/
```

`PRODUCT_REFERENCE_PREFIX` debe ser corto, sin espacios y diferente para cada producto. Una vez que un producto ya tenga ventas, no cambies su prefijo: se utiliza para validar que el pago corresponda a ese curso.

Puedes reutilizar la misma cuenta de Mercado Pago, Brevo y el mismo píxel de Meta. Para medir cada producto por separado, crea campañas distintas y utiliza el nombre del producto enviado en los eventos. Las credenciales privadas permanecen exclusivamente en Railway; nunca deben copiarse dentro de `src/product-config.js` ni subirse a GitHub.

Antes de publicar una copia ejecuta:

```bash
npm run build
node --check server.js
```
