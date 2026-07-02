import Contact from "../models/contact.model.js";

class ContactRepository {

    async create(sender_id, receiver_id) {
        return await Contact.create({
            fk_sender_id: sender_id,
            fk_receiver_id: receiver_id
        })
    }

    async getById(contact_id) {
        return await Contact.findById(contact_id)
    }

    async getBySenderAndReceiver(sender_id, receiver_id) {
        return await Contact.findOne({
            fk_sender_id: sender_id,
            fk_receiver_id: receiver_id
        })
    }

    async getContactsByUser(user_id) {
        return await Contact.find({
            $or: [
                { fk_sender_id: user_id, status: 'ACEPTADO' },
                { fk_receiver_id: user_id, status: 'ACEPTADO' }
            ]
        }).populate('fk_sender_id', 'name email')
          .populate('fk_receiver_id', 'name email')
    }

    async getPendingByReceiver(receiver_id) {
        return await Contact.find({
            fk_receiver_id: receiver_id,
            status: 'PENDIENTE'
        }).populate('fk_sender_id', 'name email')
    }

    async updateById(contact_id, update_data) {
        return await Contact.findByIdAndUpdate(contact_id, update_data, { new: true })
    }

    async deleteById(contact_id) {
        return await Contact.findByIdAndDelete(contact_id)
    }

    async deleteAllByUser(user_id) {
        return await Contact.deleteMany({
            $or: [
                { fk_sender_id: user_id },
                { fk_receiver_id: user_id }
            ]
        })
    }
}

const contactRepository = new ContactRepository()
export default contactRepository