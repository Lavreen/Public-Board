declare module 'react-native-aes-crypto' {
    export function encrypt(text: string, key: string, iv: string, mode: string): string
    export function decrypt(base64: string, key: string, iv: string, mode: string): string
    export function pbkdf2(text: string, salt: string, cost: number, length: number): string
    export function hmac256(cipher: string, key: string): string
    export function hmac512(cipher: string, key: string): string
    export function sha1(text: string): string
    export function sha256(text: string): string
    export function sha512(text: string): string
    export function randomUuid(): string
    export function randomKey(length: number): string
}