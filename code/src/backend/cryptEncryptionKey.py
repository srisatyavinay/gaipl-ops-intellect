from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os
import base64


# Decrypt the encrypted message
def decrypt_string(encrypted_data: str) -> str:

    password = "This is a secret message do not share it"

    # Decode the base64 encoded data
    decoded_data = base64.b64decode(encrypted_data)
    
    # Extract the salt, IV, and ciphertext
    salt = decoded_data[:16]
    iv = decoded_data[16:32]
    ciphertext = decoded_data[32:]
    
    # Derive the key using the same method as encryption
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = kdf.derive(password.encode())
    
    # Decrypt the ciphertext
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    
    return plaintext.decode()

