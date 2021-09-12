import unittest
import json
from flaskr.app import app
from flaskr.modelos import db, Cancion, CancionSchema, Usuario, UsuarioSchema, Album, AlbumSchema, Compartida_cancion, Compartida_album
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

class test_Compartir(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        nuevo_usuario = Usuario(nombre="ELadminTest", contrasena="xxx7632xxa3199930")
        db.session.add(nuevo_usuario)
        db.session.commit()
        nuevo_usuario2 = Usuario(nombre="ELadminTestCompartir", contrasena="xxx7632xxa3199930")
        db.session.add(nuevo_usuario2)
        db.session.commit()
        self.userId = nuevo_usuario.id
        self.userIdCompartir = nuevo_usuario2.id
        self.userName = "ELadminTestCompartir"

        token_de_acceso = create_access_token(identity = nuevo_usuario.id)
        self.token = token_de_acceso
        

    def test_ListaDeUsuariosInesistentes(self):
        payload = json.dumps({
            "lista": ["xxxTest12frer2132","xx1Test2frer2132","xx2Test2frer2132"]
        })

        response = self.app.post('/usuarios/lista', headers={"Content-Type": "application/json"}, data=payload)
        
        
        self.assertEqual("Error", response.json['mensaje'])
        self.assertEqual(3, len(response.json['listaNoExiste']))
        self.assertEqual(404, response.status_code)
        
    
    def test_ListaDeUsuariosExistente(self):
        payload = json.dumps({
            "nombre": "nombre",
            "lista": ["ELadminTest"]
        })

        response = self.app.post('/usuarios/lista', headers={"Content-Type": "application/json"}, data=payload)
        
        self.assertEqual("successes", response.json['mensaje'])
        self.assertEqual(202, response.status_code)

    def test_compartirCancion(self):
        nueva_cancion = Cancion(titulo="titulo8885446", minutos=3, segundos=3, interprete="interprete8887999",usuario=self.userId)
        db.session.add(nueva_cancion)
        db.session.commit()
        
        payload = json.dumps({
                "id_cancion": nueva_cancion.id,
                "lista_usuarios": [self.userName]
            })

        response = self.app.post('/cancion/compartir', headers={"Content-Type": "application/json", 'Authorization': 'Bearer '+ self.token}, data=payload)
        
        self.assertEqual("successes", response.json['mensaje'])
        self.assertEqual(202, response.status_code)

        compartida = Compartida_cancion.query.filter(Compartida_cancion.cancion_id==nueva_cancion.id, Compartida_cancion.usuario_id==self.userIdCompartir).first()

        if compartida is None:
            self.assertEqual(1, 0)
        else:
            db.session.delete(compartida)
            db.session.commit()
            db.session.delete(nueva_cancion)
            db.session.commit()


    def test_compartirAlbum(self):
        nuevo_Album = Album(titulo="titulo8885446", anio=2021, descripcion="interprete88879993dc222", medio="CD")
        db.session.add(nuevo_Album)
        db.session.commit()
        
        payload = json.dumps({
                "id_album": nuevo_Album.id,
                "lista_usuarios": [self.userName]
            })

        response = self.app.post('/album/compartir', headers={"Content-Type": "application/json", 'Authorization': 'Bearer '+ self.token}, data=payload)
        
        self.assertEqual("successes", response.json['mensaje'])
        self.assertEqual(202, response.status_code)
        compartida = Compartida_album.query.filter(Compartida_album.album_id==nuevo_Album.id, Compartida_album.usuario_id==self.userIdCompartir).first()
        if compartida is None:
            self.assertEqual(1, 0)
        else:
            db.session.delete(compartida)
            db.session.commit()
            db.session.delete(nuevo_Album)
            db.session.commit()


    
    def tearDown(self):
        user = Usuario.query.get_or_404(self.userId)
        db.session.delete(user)
        db.session.commit()
        user = Usuario.query.get_or_404(self.userIdCompartir)
        db.session.delete(user)

        db.session.commit()