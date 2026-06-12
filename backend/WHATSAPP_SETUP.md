# WhatsApp Business Bot

## Variables en Render

Agrega estas variables al servicio `global-gs-backend` en Render:

```txt
PUBLIC_STORE_URL=https://globalgsstore.com
WHATSAPP_VERIFY_TOKEN=elige_un_token_secreto
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_de_meta
WHATSAPP_ACCESS_TOKEN=tu_token_de_meta
OWNER_WHATSAPP_NUMBER=18292215896
```

Mantén también las variables existentes de MongoDB, JWT y Cloudinary.

## Webhook para Meta

En Meta Developers, configura el webhook de WhatsApp con:

```txt
https://global-gs-backend.onrender.com/api/whatsapp/webhook
```

El token de verificación debe ser igual a `WHATSAPP_VERIFY_TOKEN`.

## Qué hace el bot

- Responde saludos básicos.
- Busca productos por nombre, modelo, categoría o descripción.
- Envía precio, disponibilidad y enlace al producto.
- Detecta intención de compra.
- Crea un lead en MongoDB.
- Notifica al número de `OWNER_WHATSAPP_NUMBER`.

## Notas

El bot puede funcionar sin IA para ahorrar costos. Más adelante se puede agregar IA solo para mensajes ambiguos.
