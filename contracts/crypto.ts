import Env from '@ioc:Adonis/Core/Env';

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const iv = Buffer.from(Env.get('ENCRYPTION_IV'), 'hex');

export default class Crypto {
  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(Env.get('ENCRYPTION_KEY'), 'hex'), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted = encrypted + cipher.final('hex');
    return encrypted;
  }

  static decrypt(text: string): string {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(Env.get('ENCRYPTION_KEY'), 'hex'), iv);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted = decrypted + decipher.final('utf-8');
    return decrypted;
  }
}