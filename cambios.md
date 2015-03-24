# Cambios en esta rama de kiwii, master_plugins_ant

    - Incluir template de login, in index.html.tmpl de kiwii
    - Plugin de auto_login solo funciona con nuestra template.
    - El plugin de social actualmente a día 17 de marzo, no funciona por si solo, hay que tocar código de kiwii
    - Se incluyó las cabeceras en server/httphandler.js  #L75 y #L183
    - Añadir plugin de social_profile, Al abrir un privado se muestra el perfil del usuario.  
        - Se añáde el rightbar como como componente global en src/models/application.js #L128 y #L129
        - Modificar function show de src/views/rightbar.js 
