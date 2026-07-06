import { Resend } from 'resend'
import ENVIRONMENT from './environment.config.js'

const resend = new Resend(ENVIRONMENT.RESEND_API_KEY)

export default resend