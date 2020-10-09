from Crypto.Cipher import AES #importamos la librería para poder encriptar y desencriptar
from Crypto.Random import get_random_bytes #Esta librería nos ayuda
def encode(): #Definimos la función para encriptar mensajes
    key = get_random_bytes(32) #Generamos una llave que son Bytes aleatorios para la función de encriptar
    cipher = AES.new(key, AES.MODE_EAX) #Instanciamos el objeto para encriptar utilizando la Key de bytes aleatorios generados y diciéndole el método de encriptación
    nonce = cipher.nonce #Este objeto se usa para desencriptar y solo se ejecuta una vez
    data = input('Type a message to encrypt: ') #Pide al usuario introducir el mensaje que se va a encripotar
    data = data.encode() #Se convierte el mensaje del usuario a Bytes
    ciphertext, tag = cipher.encrypt_and_digest(data) #Se encripta el mensaje y el Tag que servirá para verificar el mensaje más adelante
    print(f'Encrypted message {ciphertext}') #Se imprime el mensaje encriptado 
    file_out = open("mensaje.bin", "wb") #Se abre un binario nuevo en caso de que no exista llamado mensaje.bin
    file_out.write(ciphertext) #Sobreescribe el contenido del binario abierto
    file_out.close() #Cierra el archivo
    file_out = open("llave.bin", "wb") #Se abreel binario llamado llave.bin
    file_out.write(key) #se sobreescribe el valor de la llave en el archivo 
    file_out.close()#Cierra el archivo
    file_out = open("instancia.bin", "wb") #Se abre el archivo para la instancia del Nonce
    file_out.write(nonce)#Se sobreescribe con el valor de la variable Nonce
    file_out.close()#Cierra el archivo
#Lo anterior es debido a que se deben dar los mismo argumentos para las funciones para que se pueda obtener el mismo mensaje, es decir, necesitamos la instancia, la llave y el mensaje exactamente igual
def decode(): #Se define la función para desencriptar
    #Se lee el contenido de los archivos mensaje, llave e instancia.bin para ser usados para desencriptar el mensaje guardado en el binario Mensaje
    data = open("mensaje.bin", "rb").read()
    key = open("llave.bin", "rb").read()
    nonce = open("instancia.bin", "rb").read()
    cipher = AES.new(key, AES.MODE_EAX, nonce = nonce) #Se crea el objeto para poder desencriptar usando los valores antes definidos a partir de los binarios
    plaintext = cipher.decrypt(data) #Se define el texto ya desencriptado con la función de descrypt enviándole el valor del mensaje.bin como parámetro
    print('Decrypted Message: ',plaintext.decode()) #Se imprime el mensaje desencriptado 

def main(option): #Se define la  función principal
    if option == 1:
        encode() #Encriptar
    elif option==2:
        decode() #Desencriptar
    else:
        print('Fail, choose a valid option') #En aso de que no elija una opción dentro del menú
if __name__ == '__main__':
    while True:#Definimos un bucle infinito que será roto más adelante por una condición
        option = int(input("""

        Choose an option:


        (1) -> encode message

        (2) -> decode message

        (3) -> Exit

        """)) #Menú bonito que lee una variable entera del usuario
        if option == 3:
            break #El bucle se rompe y no entra a la función main si se introduce la opción 3 que es salir
        main(option) #Se llama a la función principal y se le envia la opción como parámetro