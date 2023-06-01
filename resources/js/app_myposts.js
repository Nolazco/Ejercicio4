const app_myposts = {

    url : "/app/app.php",

    mp : $("#my-posts"),

    getMyPosts : function(uid){
       let html = `<tr><td colspan="3">Aún no tiene publicaciones</td></tr>`;
       this.mp.html("");
       fetch(this.url + "?_mp&uid=" + uid)
            .then( resp => resp.json())
            .then( mpresp => {
                if( mpresp.length > 0 ){
                    html = "";
                    for( let post of mpresp ){
                        html += `<tr>
                                    <td>${ post.title }</td>
                                    <td>${ post.created_at }</td>
                                    <td>${ post.updated_at != null ? post.updated_at : "Sin edición" }</td>
                                    <td>
                                        <a href="#" class="link-primary" data-bs-toggle="modal" data-bs-target="#modalBody-${ post.id }"><i class="bi bi-eye"></i></a>
                                        <a href="#" class="link-primary mx-2" data-bs-toggle="modal" data-bs-target="#editPost-${ post.id }"><i class="bi bi-pencil-square"></i></a>
                                        <a href="#" class="link-${post.active == 1 ? 'success' : 'danger'}" onclick="app_myposts.togglePostActive(${ post.id }, ${ uid })">
                                          <i class="bi bi-toggle-${post.active == 1 ? 'on' : 'off'}"></i>
                                        </a>
                                        <a href="#" class="link-secondary mx-2" onclick="app.confirmation(event, ${ post.id })"><i class="bi bi-trash"></i></a>

                                        <!-- Modal para visualizar el post -->
                                        <div class="modal fade" id="modalBody-${ post.id }" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog modal-dialog-scrollable">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">${ post.title }</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div class="modal-body">
                                                ${ post.body }
                                              </div>
                                              <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <!-- Modal para editar post -->
                                        <div class="modal fade" id="editPost-${ post.id }" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Editar publicacion</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                              </div>
                                              <div class="modal-body">
                                                <form>
                                                  <div class="mb-3">
                                                    <label for="recipient-name" class="col-form-label">Titulo:</label>
                                                    <input type="text" class="form-control" id="postTitle-${ post.id }" value="${ post.title }">
                                                  </div>
                                                  <div class="mb-3">
                                                    <label for="message-text" class="col-form-label">Cuerpo:</label>
                                                    <textarea class="form-control" id="postBody-${ post.id }">${ post.body }</textarea>
                                                  </div>
                                                </form>
                                              </div>
                                              <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <button type="button" class="btn btn-primary" onclick="app_myposts.editPost(${ post.id })">Editar</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                    </td>
                                </tr>`;
                    }
                }
                this.mp.html(html);
            }).catch( err => console.error( err ));  
    },
    editPost : function(pid){
        const datos = new FormData();
        datos.append('pid',pid);
        datos.append("title",$("#postTitle-"+pid).val());
        datos.append("body",$("#postBody-"+pid).val());
        datos.append('_ep',"");
        fetch(app.routes.editpost,{
            method:"POST",
            body: datos
        }).then( () => {
            location.reload();
        }).catch( err => console.error( "Hay un error: ", err));
    },
    togglePostActive : function(pid, uid){
      fetch(this.url + "?_tpa&pid=" + pid)
        .then(resp => {
          if(resp.ok){
            alert("Publicacion actualizada correctamente");
            this.getMyPosts(uid);
          }
        }).catch(err => console.error("Hay un error: ", err));
    },
}