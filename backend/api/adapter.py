from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):


    def pre_social_login(self, request, sociallogin):
        """
        Este método se ejecuta justo después de que un usuario se autentica
        con un proveedor social (como Google), pero antes de que el proceso
        de login/signup de allauth se complete.


        Aquí es donde implementaremos nuestra lógica de vinculación.
        """
        User = get_user_model()


        if request.user.is_authenticated:
            return


        email = sociallogin.account.extra_data.get('email')


        if email:
            try:
                user = User.objects.filter(email__iexact=email).first()


                if user:
                    if not sociallogin.is_existing:
                        print(f"Vinculando cuenta social de {email} al usuario existente {user.username}")
                        sociallogin.connect(request, user)
                   
                    raise ImmediateHttpResponse(redirect('/'))


            except User.DoesNotExist:
                pass
    def populate_user(self, request, sociallogin, data):
        """
        Este método se llama justo antes de guardar el usuario.
        Aquí podemos decidir qué datos de la cuenta social (Google) se usan
        para rellenar los campos del modelo User.
        """
        user = super().populate_user(request, sociallogin, data)

        if user.first_name:
            return user
        
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
            
        return user