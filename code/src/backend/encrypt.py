from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os
import base64

def encrypt_string(plaintext: str) -> str:
    # Generate a random salt
    salt = os.urandom(16)
    password = "This is a secret message do not share it"
    
    # Derive a key from the password
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = kdf.derive(password.encode())
    
    # Generate a random initialization vector (IV)
    iv = os.urandom(16)
    
    # Encrypt the plaintext
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
    
    # Combine salt, IV, and ciphertext for storage
    encrypted_data = base64.b64encode(salt + iv + ciphertext).decode()
    return encrypted_data

# run this code to encrypt a string. Uncomment it
# print(encrypt_string("<your-gemini-key>"))