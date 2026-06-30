# TRN Publisher

Aplicación web para publicar artículos como borradores en WordPress usando Next.js 15, TypeScript, Tailwind CSS y WordPress REST API.

## Funciones v1

- Campo título.
- Extracto SEO.
- Editor de contenido.
- Selector de categoría cargado desde WordPress.
- Campo etiquetas separadas por comas.
- Creación automática de etiquetas si no existen.
- Publicación como borrador.
- Preparado para desplegar en Vercel.

## Configuración local

1. Instala dependencias:

```bash
npm install
```

2. Copia el archivo de entorno:

```bash
cp .env.example .env.local
```

3. Rellena las variables:

```env
WP_URL=https://trnandalucia.com
WP_USER=tu_usuario_wordpress
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

El usuario debe tener permisos para crear entradas en WordPress.

4. Arranca el proyecto:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. En Vercel, importa el repositorio.
3. Añade estas variables de entorno:

- `WP_URL`
- `WP_USER`
- `WP_APP_PASSWORD`

4. Pulsa Deploy.

## Arquitectura preparada para crecer

La conexión con WordPress está centralizada en `lib/wordpress/client.ts`, por lo que será sencillo añadir:

- Imagen destacada.
- Subida de medios.
- SEO avanzado.
- Enlaces internos automáticos.
- Programación de publicaciones.
- IA editorial.
