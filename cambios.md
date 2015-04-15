# Cambios en esta rama de kiwii, master_plugins_ant

    - Incluir template de login, in index.html.tmpl de kiwii
    - Plugin auto_login
        - Plugin de auto_login solo funciona con nuestra template.
        - Ahora funciona con window.token o con un parámetro en la url token (8 de abril 2015)
        - Tambien hace un identify si el nick con el que entras al chat, es el mismo que viene como parámetro en token_user. Entonces el nick es del usuario y podemos identificarlo y hacemos el identify
    - Se incluyó las cabeceras en server/httphandler.js  #L75 y #L183
    - Plugin social_profile
        - El plugin de social actualmente a día 17 de marzo, no funciona por si solo, hay que tocar código de kiwii
        - Añadir plugin de social_profile, Al abrir un privado se muestra el perfil del usuario. (Commit: 7baf595a029d7102e62003a56816f70e638831cd)  
            - Se añáde el rightbar como como componente global en src/models/application.js #L128 y #L129
            - Modificar function show de src/views/rightbar.js 
            - Modificar function show de memberlist.js ( Commit: el anterior +2)
        - Añadir traducción a social_profile (Commit: 1204118e976c4fb2b95f45c9d6790e87744a6840)
            - Se modifico server/helpers/build.js
    - Eliminado el icono de kiwii en el chat, borrado de la index.html.tmpl
        - <li><a href="https://kiwiirc.com/" target="_blank"><img src="<%base_path%>/assets/img/ico.png" alt="KiwiIRC" title="KiwiIRC" />
