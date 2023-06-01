const app = {

    routes : {
        inisession : "/resources/views/auth/login.php",
        endsession : "/app/app.php?_logout",
        login : "/app/app.php",
        register : "/resources/views/auth/register.php",
        doregister : "/app/app.php",
        prevposts : "/app/app.php?_pp",
        lastpost : "/app/app.php?_lp",
        openpost : "/app/app.php?_op",
        newpost : "/resources/views/autores/newpost.php",
        myposts : "/resources/views/autores/myposts.php",
        deletepost : "/app/app.php?_dp",
        togglelike : "/app/app.php?_tl",
        postcomments : "/app/app.php?_pm",
        savecomment : "/app/app.php",
        editpost : "/app/app.php",
    },

    user : {
        sv : false,
        id : "",
        tipo : "",
    },

    pp : $("#prev-posts"),
    lp : $("#content"),

    view : function(route){
        location.replace(this.routes[route]);
    },
    previousPosts : function(){
        let html = `<b>Aún no hay publicaciones en este blog</b>`;
        this.pp.html("");
        fetch(this.routes.prevposts)
            .then( resp => resp.json())
            .then( ppresp => {
                if( ppresp.length > 0){
                    html = "";
                    let primera = true;
                    for( let post of ppresp ){
                        html += `
                            <a href="#" onclick="app.openPost(event,${ post.id },this)"
                                class="list-group-item list-group-item-action mb-2 ${ primera ? `active`:``} pplg">
                                <div class="w-100 border-bottom">
                                    <h5 class="mb-1">${ post.title }</h5>
                                    <small class="text-${ primera ? `light` : `muted` }">
                                        <i class="bi bi-calendar-week"></i> 
                                        ${ post.fecha }
                                    </small>
                                </div>
                                <small>
                                    <i class="bi bi-person-circle"></i>
                                    <b>${ post.name }</b>
                                </small>
                            </a>
                        `;
                        primera = false;
                    }
                    this.pp.html(html);
                }
            }).catch( err => console.error( err ));

    },
    lastPost : function(limit){
        let html = "<h2>Aún no hay publicaciones</h2>";
        this.lp.html("");

        fetch(this.routes.lastpost + "&limit=" + limit)
            .then( response => response.json())
            .then( lpresp => {
                console.log(lpresp[0]);
                if( lpresp.length > 0 ){
                    html = this.postHTMLLoad(lpresp);
                }
                this.lp.html(html);
            }).catch( err => console.error( err ));
    },
    openPost : function(event,pid,element){
        event.preventDefault();
        $(".pplg").removeClass("active");
        element.classList.add("active");
        this.lp.html("");
        let html = "";
        fetch(this.routes.openpost + "&pid=" + pid)
            .then( response => response.json())
            .then( post => {
                console.log(post[0]);
                html = this.postHTMLLoad(post);
                this.lp.html(html);
            }).catch( err => console.error( "Error al abrir la pulicación : ",err ));
    },
    confirmation : async function(event, pid){
        const conf = confirm("Se eliminará la publicación así como sus comentarios en caso de que los haya. ¿Desea continuar?");
        if(conf){
            let del = await fetch(this.routes.deletepost + "&pid=" + pid);
            let resp = await del.json();

            if(resp){
                alert("Se ha borrado la publicación");
                return location.reload();
            }else{
                alert("Pipipipipi");
                return location.reload();
            }      
        }
    },
    postHTMLLoad : function(post){
        console.table(post);
        return `
                <div class="w-100 p-4 border-bottom bg-body rounded shadow">
                    <h5 class="mb-1">${ post[0].title }</h5>
                    <small class="text-muted">
                        <i class="bi bi-calendar-week"></i> ${ post[0].fecha } | 
                        <i class="bi bi-person-circle"></i> ${ post[0].name }
                    </small>
                    <p class="bm-1 border-bottom fs-3" style="text-align:justify;">
                        ${ post[0].body }
                    </p>
                    <a href="#" class="btn btn-link btn-sm text-decoration-none ${ this.user.sv ? '' : ' disabled '}"
                    onclick="app.toggleLike(event, ${app.user.id}, ${post[0].id})">
                        <i class="bi bi-hand-thumbs-up${post[3].tt > 0 ? '-fill ' : ''}"></i> <span id="likes">${ post[2].tt }</span>
                    </a>
                    <p class="float-end">
                        <span id="comentarios">
                            <a href="#" onclick="app.toggleComments(event, ${post[0].id}, '#post-comments')" 
                            class="btn btn-link btn-sm text-decoration-none 
                            ${ post[1].tt > 0 ? '': 'disabled'} link-secondary"
                            rol="button">
                                <i class="bi bi-chat-right-dots"></i>
                                ${ post[1].tt } comentarios
                            </a>
                        </span>
                    </p>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control rounded-5 bg-body" ${ this.user.sv ? '' : ' disabled readonly '} 
                            placeholder="${ this.user.sv ? 'Deja tu comentario' : 'Regístrate para poder hacer comentarios' }" 
                            name="comment" id="comment"
                            aria-label="Recipient's username" 
                            aria-describedby="button-addon2">
                        <button class="btn btn-outline-secondary rounded-5 btn-outline-primary ${ this.user.sv ? '' : ' disabled '}" type="button" id="button-addon2" onclick="app.saveComment(${ post[0].id });">
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                    <div class="container mb-2 fs-6">
                        <ul class="list-group d-none" id="post-comments">

                        </ul>
                    </div>
                </div>
            `;
    },
    toggleLike : function(e, uid, pid){
        e.preventDefault();
        fetch(this.routes.togglelike + "&uid=" + uid + "&pid=" + pid)
            .then(response => response.json())
            .then(likes => {
                $("#likes").html(likes[0].tt)
            }).catch(err => console.error("Hay un error: ", err));
    },
    toggleComments : function(e, pid, element){
        if(e){
            e.preventDefault();
            $(element).toggleClass("d-none");
        }else{
            $(element).removeClass("d-none");            
        }
        fetch(this.routes.postcomments + "&pid=" + pid)
            .then(resp => resp.json())
            .then(comments => {
                if(comments.length > 0){
                    let html = "";
                    for(let c of comments){
                        html += `
                                <li class="list-group-item">
                                    <p class="fw-bold mb-0">${c.name}</p>
                                    <p>${c.comment}</p>
                                </li>
                        `;
                    }
                    $(element).html(html);
                }
            }).catch(err => console.error("Hay un error: ", err));
    },
    saveComment : function(pid){
        if($("#comment").val() !== ""){
            const datos = new FormData();
            datos.append('pid',pid);
            datos.append("comment",$("#comment").val());
            datos.append('_sc',"");
            fetch(this.routes.savecomment,{
                method:"POST",
                body: datos
            }).then( () => {
                $("#comment").val("");
                this.toggleComments(null, pid, "#post-comments");
            }).catch( err => console.error( "Hay un error: ", err));
        }
    }
}