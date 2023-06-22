from django.db import models

class Alumno(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    foto = models.ImageField(upload_to='fotos/', blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    
class Alumno_Horario(models.Model):
    id = models.AutoField(primary_key=True)
    id_Alumnos = models.ForeignKey(Alumno, on_delete=models.CASCADE, db_index=True, related_name='horarios')
    horario_ingreso = models.TimeField()
    horario_salida = models.TimeField()

    def __str__(self):
        ingreso = self.horario_ingreso.strftime("%H:%M")  # Formato de hora (HH:MM)
        salida = self.horario_salida.strftime("%H:%M")  # Formato de hora (HH:MM)
        return f"Alumno: {self.id_Alumnos} - Ingreso: {ingreso} - Salida: {salida}"
