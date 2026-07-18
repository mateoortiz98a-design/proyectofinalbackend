# MiSlack - Backend

API REST con WebSockets para una aplicación de mensajería en tiempo real tipo Slack.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT
- Nodemailer
- bcrypt

## Instalación local

1. Cloná el repositorio:
```bash
git clone https://github.com/mateoortiz98a-design/proyectofinalbackend.git
cd proyectofinalbackend
```

2. Instalá las dependencias:
```bash
npm install
```

3. Creá el archivo `.env` en la raíz:
```env
MONGO_DB_CONNECTION_STRING=??
MONGO_DB_NAME=proyectofinalbackend
JWT_SECRET=??
PORT=8080
GMAIL_USERNAME=??
GMAIL_PASSWORD=??
URL_BACKEND=https://proyectofinalbackend-production-2db3.up.railway.app
URL_FRONTEND=https://proyectofinalfrontend-eight.vercel.app
MODE=production
MAILJET_API_KEY=??
MAILJET_SECRET_KEY=??
MAIL_FROM=??
BREVO_API_KEY=??
```

4. Iniciá el servidor:
```bash
npm run dev
```

## URL de producción

https://proyectofinalbackend-k9d0.onrender.com

## Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| GET | `/api/auth/verify-email` | Verificar email | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/reset-password-request` | Solicitar reset de contraseña | No |
| POST | `/api/auth/reset-password-confirm` | Confirmar nueva contraseña | No |

### Workspaces
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/workspace` | Crear workspace | Sí |
| GET | `/api/workspace` | Obtener mis workspaces | Sí |
| PUT | `/api/workspace/:workspace_id` | Editar workspace | Sí (Admin/Owner) |
| DELETE | `/api/workspace/:workspace_id` | Eliminar workspace | Sí (Owner) |

### Miembros de Workspace
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/workspace/:workspace_id/members` | Invitar usuario | Sí (Admin/Owner) |
| GET | `/api/workspace/:workspace_id/members` | Listar miembros | Sí |
| PUT | `/api/workspace/:workspace_id/members/:member_id` | Cambiar rol | Sí (Owner) |
| DELETE | `/api/workspace/:workspace_id/members/:member_id` | Eliminar miembro | Sí (Admin/Owner) |
| GET | `/api/workspace/:workspace_id/invite/:decision` | Procesar invitación | No |

### Canales (Group Chat)
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/group-chat/workspace/:workspace_id` | Crear canal | Sí |
| GET | `/api/group-chat/workspace/:workspace_id` | Listar canales | Sí |
| GET | `/api/group-chat/:chat_id` | Obtener canal | Sí |
| DELETE | `/api/group-chat/:chat_id` | Eliminar canal | Sí |

### Mensajes de Canal
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/message/chat/:chat_id` | Enviar mensaje | Sí |
| GET | `/api/message/chat/:chat_id` | Listar mensajes | Sí |
| PUT | `/api/message/:message_id` | Editar mensaje | Sí |
| DELETE | `/api/message/:message_id` | Eliminar mensaje | Sí |

### Chats Privados
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/private-chat` | Crear chat privado | Sí |
| GET | `/api/private-chat` | Listar mis chats privados | Sí |
| DELETE | `/api/private-chat/:chat_id` | Eliminar chat privado | Sí |

### Mensajes Privados
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/private-message/chat/:chat_id` | Enviar mensaje privado | Sí |
| GET | `/api/private-message/chat/:chat_id` | Listar mensajes privados | Sí |
| PUT | `/api/private-message/:message_id` | Editar mensaje privado | Sí |
| DELETE | `/api/private-message/:message_id` | Eliminar mensaje privado | Sí |

### Contactos
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/contact` | Enviar solicitud de contacto | Sí |
| GET | `/api/contact` | Listar contactos | Sí |
| GET | `/api/contact/pending` | Solicitudes pendientes | Sí |
| PUT | `/api/contact/:contact_id` | Aceptar/Rechazar solicitud | Sí |
| DELETE | `/api/contact/:contact_id` | Eliminar contacto | Sí |

### Usuarios
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/user` | Listar usuarios | Sí |
| GET | `/api/user/:user_id` | Obtener usuario | Sí |
| PUT | `/api/user/:user_id` | Actualizar usuario | Sí |
| DELETE | `/api/user/:user_id` | Eliminar usuario | Sí |

## WebSockets

El servidor usa Socket.io para comunicación en tiempo real.

### Eventos del cliente al servidor
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `join_user` | `user_id` | Unirse a la sala del usuario |
| `join_chat` | `chat_id` | Unirse a un canal |
| `join_private_chat` | `chat_id` | Unirse a un chat privado |
| `join_workspace` | `workspace_id` | Unirse a un workspace |

### Eventos del servidor al cliente
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `new_message` | mensaje | Nuevo mensaje en canal |
| `updated_message` | mensaje | Mensaje editado en canal |
| `deleted_message` | `{ message_id }` | Mensaje eliminado en canal |
| `new_private_message` | mensaje | Nuevo mensaje privado |
| `updated_private_message` | mensaje | Mensaje privado editado |
| `deleted_private_message` | `{ message_id }` | Mensaje privado eliminado |
| `new_contact_request` | contacto | Nueva solicitud de contacto |
| `contact_request_response` | contacto | Respuesta a solicitud |
| `workspace_invitation` | invitación | Invitación a workspace |