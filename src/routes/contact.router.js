import express from 'express'
import contactController from '../controllers/contact.controller.js'

const contactRouter = express.Router()

// Enviar solicitud
contactRouter.post('/', contactController.sendRequest)

// Ver mis contactos
contactRouter.get('/', contactController.getContacts)

// Ver solicitudes pendientes
contactRouter.get('/pending', contactController.getPendingRequests)

// Responder solicitud (ACEPTADO o RECHAZADO)
contactRouter.put('/:contact_id', contactController.respondRequest)

// Eliminar contacto
contactRouter.delete('/:contact_id', contactController.deleteContact)

export default contactRouter