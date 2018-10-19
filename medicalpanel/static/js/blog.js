function blogRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/blog/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveblog/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].blog_title + "</td>";
                h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                h += "<td>" + data[i].blog_description + "</td>";
                h += "<td>" + data[i].author  + "</td>";
                h += "<td>" + data[i].created_date  + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="bupdat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="bdel(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }

        $( document ).on('submit', '#adding', function (e) {
                   e.preventDefault();
                   var img = $('#img')[0].files[0];
                   if ($('#tit').val().length < 1){
                       $('#blog_title').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#img').val().length < 1){
                       $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#des').val().length < 1){
                       $('#blog_description').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#thor').val().length < 1){
                       $('#author').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   var reader = new FileReader();
                   reader.readAsBinaryString(img);
                    reader.onloadend = function () {
                        var base64 = btoa(reader.result);
                        console.log(base64);
                        var title = $('#tit').val();
                        var desc = $('#des').val();
                        var thor = $('#thor').val();
                        console.log(title);
                        console.log(desc);
                        console.log(thor);
                        var data = {
                           blog_title: title,
                           image: base64,
                           blog_description: desc,
                           author: thor,
                       };
                        console.log(data);
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/blog/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: data,
                            success:function (res) {
                                if (res.status == 'ok'){
                                    blogRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#blog_title').html("");
                                    $('#image').html("");
                                    $('#blog_description').html("");
                                    $('#author').html("");
                                }else if (res.status=="error") {
                                    var keys = Object.keys(res.message);
                                    console.log(keys);
                                    for (var i = 0; i < keys.length; i++) {
                                        var msg = res.message[keys[i]];
                                        var key = keys[i];
                                        $('#'+key).html("<span class='errorlist'>"+msg+"</span>");
                                    }
                                }
                            }
                        });
                    };
        });

        // <!--Update getting-->
        function bupdat(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
           $.ajax({
                 type:"GET",
                 url: u,
            })
            .done(function( msg ) {
                var title = msg.blog_title;
                var image = msg.image;
                var description = msg.blog_description;
                var author = msg.author;

                var x = document.createElement('input');
                x.value = title;
                x.id = 'tito';
                x.name = 'title';
                x.className = 'form-control';
                x.type = 'text';

                var m = document.createElement('a');
                m.textContent = "Currently: http://localhost:8000/media/" + image;
                m.href = "http://localhost:8000/media/" + image;
                m.target = '_blank';
                m.id = 'current';

                var i = document.createElement('input');
                i.value = "image";
                i.id = 'im';
                i.name = 'image';
                i.className = 'form-control';
                i.type = 'file';

                var y = document.createElement('textarea');
                y.value = description;
                y.id = 'dest';
                y.name = 'description';
                y.rows = '7';
                y.className = 'form-control';
                y.type = 'text';

                var z = document.createElement('input');
                z.value = author;
                z.id = 'au';
                z.name = 'author';
                z.className = 'form-control';
                z.type = 'text';

                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(m);
                div.appendChild(i);
                div.appendChild(y);
                div.appendChild(z);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function UBSubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length > 1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#tito').val();
                    var dest = $('#dest').val();
                    var au = $('#au').val();
                    console.log(tito);
                    console.log(dest);
                    console.log(au);
                    var data = {
                        blog_title: tito,
                        image: base64,
                        blog_description: dest,
                        author: au,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            blogRedirecting();
                        });
                }
            }else{
                var tito = $('#tito').val();
                    var dest = $('#dest').val();
                    var au = $('#au').val();
                    var data = {
                        blog_title: tito,
                        blog_description: dest,
                        author: au,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            blogRedirecting();
                        });
            }
        }

        // <!--Delete getting-->
        function bdel(ref) {
           var u = $(ref).attr('data-url');
           $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function DBSubmit(ref){
            var u = $(ref).attr('data-url');
            $.ajax({
                 type:"DELETE",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 }
            })
            .done(function( msg ) {
            console.log(msg);
            blogRedirecting();
            });
        }

        function bannerRedirecting() {
            $.ajax({
                method: "GET",
                url: "http://localhost:8000/panel/api/banner/",
            })
                .done(function (msg) {
                    var data = JSON.parse(msg);
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        var h = "<tr>";
                        var url = "http://localhost:8000/panel/api/retrievebanner/0";
                        url = url.slice(0, url.length - 1) + data[i].id;
                        url = "data-url=" + url;
                        h += "<td>" + data[i].id + "</td>";
                        h += "<td>" + data[i].title + "</td>";
                        h += "<td>" + data[i].code + "</td>";
                        h += "<td>" + data[i].short_description + "</td>";
                        h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                        h += "<td>" + data[i].number + "</td>";
                        h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-edit"' + url + ' data-toggle="modal" data-target="#Update" onclick="bannerUpdate(this)"></button>' + "</td>"
                        h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-trash"' + url + ' data-toggle="modal" data-target="#Delete" onclick="bannerDelete(this)"></button>' + "</td>"
                        h += "</tr>";
                        html += h;
                    }
                    $("#blog").html(html);
                });
        }

        $(document).on('submit', '#banneradding', function (e) {
            e.preventDefault();
            var img = $('#img')[0].files[0];
            if ($('#tit').val().length < 1) {
                $('#title').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#cod').val().length < 1) {
                $('#code').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#des').val().length < 1) {
                $('#short_description').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#img').val().length < 1) {
                $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#num').val().length < 1) {
                $('#number').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            var reader = new FileReader();
            reader.readAsBinaryString(img);
            reader.onloadend = function () {
                var base64 = btoa(reader.result);
                console.log(base64);
                var title = $('#tit').val();
                var code = $('#cod').val();
                var desc = $('#des').val();
                var number = $('#num').val();
                var data = {
                    title: title,
                    code: code,
                    short_description: desc,
                    image: base64,
                    number: number,
                };
                console.log(data);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8000/panel/api/banner/',
                    headers: {
                        'X-CSRFToken': "{{ csrf_token }}",
                    },
                    data: data,
                    success: function (res) {
                        if (res.status == 'ok') {
                            bannerRedirecting();
                            document.getElementById("banneradding").reset();
                            $('#completed').html("<span class='successMsg'>" + res.message + "</span>");
                            $('#title').html("");
                            $('#code').html("");
                            $('#short_description').html("");
                            $('#image').html("");
                            $('#number').html("");
                        } else if (res.status == "error") {
                            var keys = Object.keys(res.message);
                            console.log(keys);
                            for (var i = 0; i < keys.length; i++) {
                                var msg = res.message[keys[i]];
                                var key = keys[i];
                                $('#' + key).html("<span class='errorlist'>" + msg + "</span>");
                            }
                        }
                    }
                });
            };
        });

        //
        <!--Update getting-->
        function bannerUpdate(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
            $.ajax({
                type: "GET",
                url: u,
            })
                .done(function (msg) {
                    var title = msg.title;
                    var code = msg.code;
                    var short_description = msg.short_description;
                    var image = 'image';
                    var number = msg.number;

                    var x = document.createElement('input');
                    x.value = title;
                    x.id = 'tito';
                    x.name = 'title';
                    x.className = 'form-control';
                    x.type = 'text';

                    var c = document.createElement('input');
                    c.value = code;
                    c.id = 'co';
                    c.name = 'code';
                    c.className = 'form-control';
                    c.type = 'text';

                    var s = document.createElement('input');
                    s.value = short_description;
                    s.id = 'sh';
                    s.name = 'short';
                    s.className = 'form-control';
                    s.type = 'text';

                    var i = document.createElement('input');
                    i.value = image;
                    i.id = 'im';
                    i.name = 'image';
                    i.className = 'form-control';
                    i.type = 'file';

                    var y = document.createElement('input');
                    y.value = number;
                    y.id = 'no';
                    y.name = 'number';
                    y.className = 'form-control';
                    y.type = 'text';


                    var div = document.createElement('div');
                    div.appendChild(x);
                    div.appendChild(c);
                    div.appendChild(s);
                    div.appendChild(i);
                    div.appendChild(y);

                    $("#form").html(div);
                });
        }

        //
        <!--after getting updating-->
        function bansUSubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length > 1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#tito').val();
                    var code = $('#co').val();
                    var short = $('#sh').val();
                    var number = $('#no').val();
                    var data = {
                        title: tito,
                        code: code,
                        short_description: short,
                        image: base64,
                        number: number,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            bannerRedirecting();
                        });
                }
            } else {
                var tito = $('#tito').val();
                var code = $('#co').val();
                var short = $('#sh').val();
                var number = $('#no').val();
                var data = {
                    title: tito,
                    code: code,
                    short_description: short,
                    number: number,
                };
                console.log(data);
                $.ajax({
                    type: "PUT",
                    url: u,
                    headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                    },
                    data: data
                })
                    .done(function (msg) {
                        console.log(msg);
                        bannerRedirecting();
                    });
            }
        }

        //
        <!--Delete getting-->
        function bannerDelete(ref) {
            var u = $(ref).attr('data-url');
            $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function bansDSubmit(ref) {
            var u = $(ref).attr('data-url');
            $.ajax({
                type: "DELETE",
                url: u,
                headers: {
                    "X-CSRFToken": "{{csrf_token}}"
                }
            })
                .done(function (msg) {
                    console.log(msg);
                    bannerRedirecting();
                });
        }

        function consultantRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/consultant/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveconsultant/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].name + "</td>";
                h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                h += "<td>" + data[i].description + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="cupdat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="cdel(this)"></button>'+"</td>"
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }

        $( document ).on('submit', '#addingconsultant', function (e) {
                   e.preventDefault();
                   var img = $('#img')[0].files[0];
                   if ($('#nm').val().length < 1){
                       $('#name').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#img').val().length < 1){
                       $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#des').val().length < 1){
                       $('#description').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   var reader = new FileReader();
                   reader.readAsBinaryString(img);
                    reader.onloadend = function () {
                        var base64 = btoa(reader.result);
                        console.log(base64);
                        var name = $('#nm').val();
                        var desc = $('#des').val();
                        console.log(name);
                        console.log(desc);
                        var data = {
                           name: name,
                           image: base64,
                           description: desc,
                       };
                        console.log(data);
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/consultant/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: data,
                            success:function (res) {
                                if (res.status == 'ok'){
                                    consultantRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#name').html("");
                                    $('#image').html("");
                                    $('#description').html("");
                                }else if (res.status=="error") {
                                    var keys = Object.keys(res.message);
                                    console.log(keys);
                                    for (var i = 0; i < keys.length; i++) {
                                        var msg = res.message[keys[i]];
                                        var key = keys[i];
                                        $('#'+key).html("<span class='errorlist'>"+msg+"</span>");
                                    }
                                }
                            }
                        });
                    };
        });

        // <!--Update getting-->
        function cupdat(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
           $.ajax({
                 type:"GET",
                 url: u,
            })
            .done(function( msg ) {
                var name = msg.name;
                var image = msg.image;
                var description = msg.description;

                var x = document.createElement('input');
                x.value = name;
                x.id = 'names';
                x.name = 'name';
                x.className = 'form-control';
                x.type = 'text';


                var i = document.createElement('a');
                i.textContent = "Currently: http://localhost:8000/media/" + image;
                i.href = "http://localhost:8000/media/" + image;
                i.target = '_blank';
                i.id = 'current';

                var o = document.createElement('input');
                o.value = "image";
                o.id = 'im';
                o.name = 'image';
                o.className = 'form-control';
                o.type = 'file';
                o.required = false;

                var y = document.createElement('input');
                y.value = description;
                y.id = 'desp';
                y.name = 'description';
                y.className = 'form-control';
                y.type = 'text';


                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(i);
                div.appendChild(o);
                div.appendChild(y);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function cUSubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length >1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#names').val();
                    var short = $('#desp').val();
                    var data = {
                        name: tito,
                        image: base64,
                        description: short,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            consultantRedirecting();
                        });
                }
            }else{
                var tito = $('#names').val();
                    var short = $('#desp').val();
                    var data = {
                        name: tito,
                        description: short,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            consultantRedirecting();
                        });
            }
        }

        // <!--Delete getting-->
        function cdel(ref) {
           var u = $(ref).attr('data-url');
           $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function cDSubmit(ref){
            var u = $(ref).attr('data-url');
            $.ajax({
                 type:"DELETE",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 }
            })
            .done(function( msg ) {
            console.log(msg);
            consultantRedirecting();
            });
        }

        function inputRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/input/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveinput/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].clients_served + "</td>";
                h += "<td>"  + data[i].x_rays_done + "</td>";
                h += "<td>" + data[i].worldwide_stuff + "</td>";
                h += "<td>" + data[i].lives_saved  + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="iupdat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="idel(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }

        $( document ).on('submit', '#inputadding', function (e) {
                   e.preventDefault();
                   if ($('#clients').val().length < 1){
                       $('#clients_served').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#xrays').val().length < 1){
                       $('#x_rays_done').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#stuff').val().length < 1){
                       $('#worldwide_stuff').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#lives').val().length < 1){
                       $('#lives_saved').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/input/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: {
                                clients_served :$('#clients').val(),
                                x_rays_done : $('#xrays').val(),
                                worldwide_stuff: $('#stuff').val(),
                                lives_saved : $('#lives').val()
                            },
                            success:function (res) {
                                if (res.status == 'ok'){
                                    inputRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#clients_served').html("");
                                    $('#x_rays_done').html("");
                                    $('#worldwide_stuff').html("");
                                    $('#lives_saved').html("");
                                }else if (res.status=="error") {
                                    var keys = Object.keys(res.message);
                                    console.log(keys);
                                    for (var i = 0; i < keys.length; i++) {
                                        var msg = res.message[keys[i]];
                                        var key = keys[i];
                                        $('#'+key).html("<span class='errorlist'>"+msg+"</span>");
                                    }
                                }
                            }
                        });
        });

        // <!--Update getting-->
        function iupdat(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
           $.ajax({
                 type:"GET",
                 url: u,
            })
            .done(function( msg ) {
                var cli = msg.clients_served;
                var xray = msg.x_rays_done;
                var world = msg.worldwide_stuff;
                var saved = msg.lives_saved;

                var x = document.createElement('input');
                x.value = cli;
                x.id = 'tito';
                x.name = 'title';
                x.className = 'form-control';
                x.type = 'text';

                var i = document.createElement('input');
                i.value = xray;
                i.id = 'im';
                i.name = 'image';
                i.className = 'form-control';
                i.type = 'text';


                var y = document.createElement('input');
                y.value = world;
                y.id = 'dest';
                y.name = 'description';
                y.className = 'form-control';
                y.type = 'text';

                var z = document.createElement('input');
                z.value = saved;
                z.id = 'au';
                z.name = 'author';
                z.className = 'form-control';
                z.type = 'text';

                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(i);
                div.appendChild(y);
                div.appendChild(z);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function iUSubmit(ref) {
           var u = $(ref).attr('data-url');
           $.ajax({
                 type:"PUT",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 },
                 data: {
                        'clients_served': $('#tito').val(),
                        'x_rays_done': $('#im').val(),
                        'worldwide_stuff': $('#dest').val(),
                        'lives_saved': $('#au').val()
                        }
            })
            .done(function( msg ) {
             console.log(msg);
             inputRedirecting();
          });
        }

        // <!--Delete getting-->
        function idel(ref) {
           var u = $(ref).attr('data-url');
           $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function iDSubmit(ref){
            var u = $(ref).attr('data-url');
            $.ajax({
                 type:"DELETE",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 }
            })
            .done(function( msg ) {
            console.log(msg);
            inputRedirecting();
            });
        }


    function appintmentRedirecting() {
                $.ajax({
                    method: "GET",
                    url: "http://localhost:8000/panel/api/appointment/",
                })
                    .done(function (msg) {
                        var data = JSON.parse(msg);
                        var html = "";
                        for (var i = 0; i < data.length; i++) {
                            var h = "<tr>";
                            var url = "http://localhost:8000/panel/api/retrieveappointment/0";
                            url = url.slice(0, url.length - 1) + data[i].id;
                            url = "data-url=" + url;
                            h += "<td>" + data[i].id + "</td>";
                            h += "<td>" + data[i].patient_name + "</td>";
                            h += "<td>" + data[i].phone + "</td>";
                            h += "<td>" + data[i].appointment_date + "</td>";
                            h += "<td>" + data[i].message + "</td>";
                            h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-edit"' + url + ' data-toggle="modal" data-target="#Update" onclick="appointmentUpdate(this)"></button>' + "</td>";
                            h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-trash"' + url + ' data-toggle="modal" data-target="#Delete" onclick="appointmentDelete(this)"></button>' + "</td>";
                            h += "</tr>";
                            html += h;
                        }
                        $("#blog").html(html);
                    });
            }

            $(document).on('submit', '#bookingform', function (e) {
                e.preventDefault();

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8000/panel/api/appointment/',
                    data: {
                        patient_name: $('#patient').val(),
                        phone: $('#phn').val(),
                        appointment_date: $('#appointment').val(),
                        message: $('#msg').val(),
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        ajax: true,
                    }, success: function (res) {
                        if (res.status == 'ok') {
                            appintmentRedirecting();
                            $('#completed').html("<span class='successMsg'>" + res.message + "</span>");
                            document.getElementById("bookingform").reset();
                            $('#patient_name').html("");
                            $('#phone').html("");
                            $('#appointment_date').html("");
                            $('#message').html("");
                        } else if (res.status == "error") {
                            var keys = Object.keys(res.message);
                            console.log(keys);
                            for (var i = 0; i < keys.length; i++) {
                                var msg = res.message[keys[i]];
                                var key = keys[i];
                                $('#' + key).html("<span class='errorlist'>" + msg + "</span>");
                            }
                        }
                    }
                });
            });


            <!--Update getting-->
            function appointmentUpdate(ref) {
                var u = $(ref).attr('data-url');
                $('#update-user').attr('data-url', u);
                $.ajax({
                    type: "GET",
                    url: u,
                })
                    .done(function (msg) {
                        var name = msg.patient_name;
                        var phone = msg.phone;
                        var dated = msg.appointment_date;
                        var message = msg.message;

                        var x = document.createElement('input');
                        x.value = name;
                        x.id = 'names';
                        x.name = 'patient_name';
                        x.className = 'form-control';
                        x.type = 'text';

                        var i = document.createElement('input');
                        i.value = phone;
                        i.id = 'mob';
                        i.name = 'phone';
                        i.className = 'form-control';
                        i.type = 'text';

                        var d = document.createElement('input');
                        d.value = dated;
                        d.id = 'ad';
                        d.name = 'appointment_date';
                        d.className = 'form-control';
                        d.type = 'date';

                        var y = document.createElement('input');
                        y.value = message;
                        y.id = 'masg';
                        y.name = 'message';
                        y.className = 'form-control';
                        y.type = 'text';


                        var div = document.createElement('div');
                        div.appendChild(x);
                        div.appendChild(i);
                        div.appendChild(d);
                        div.appendChild(y);

                        $("#form").html(div);
                    });
            }

            //
            <!--after getting updating-->
            function appointmentUSubmit(ref) {
                var u = $(ref).attr('data-url');
                $.ajax({
                    type: "PUT",
                    url: u,
                    headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                    },
                    data: {
                        'patient_name': $('#names').val(),
                        'phone': $('#mob').val(),
                        'appointment_date': $('#ad').val(),
                        'message': $('#masg').val()
                    }
                })
                    .done(function (msg) {
                        console.log(msg);
                        appintmentRedirecting();
                    });
            }


            //
            <!--Delete getting-->
            function appointmentDelete(ref) {
                var u = $(ref).attr('data-url');
                $('#delete-blog').attr('data-url', u);
            }

            <!-- after getting Deleting-->
            function appointmentDSubmit(ref) {
                var u = $(ref).attr('data-url');
                $.ajax({
                    type: "DELETE",
                    url: u,
                    headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                    }
                })
                    .done(function (msg) {
                        console.log(msg);
                        appintmentRedirecting();
                    });
            }

     function newletterRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/newsletter/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrievenewsletter/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].email + "</td>";
                h += "<td>" + data[i].dated + "</td>";
                // {#h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="update(this)"></button>'+"</td>"#}
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="ndel(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }

         $( document ).on('submit', '#newsForm', function (e) {
                   e.preventDefault();
                    var spinner = $('#spinner-subscribe');
                   spinner.removeClass('fa-arrow-right');
                   spinner.addClass('fa-spinner');
                   spinner.addClass('fa-spin');
                   $.ajax({
                       type: 'POST',
                       url: 'http://localhost:8000/panel/api/newsletter/',
                       data:{
                           email :$('#em').val(),
                           csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                       },
                       success:function (res) {
                           spinner.removeClass('fa-spinner');
                           spinner.removeClass('fa-spin');
                           spinner.addClass('fa-arrow-right');
                           if (res.status == 'ok'){
                               newletterRedirecting();
                               $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                               document.getElementById("newsForm").reset();
                               $('#error-message').html("");
                           } else if (res.status=="error") {
                               var keys = Object.keys(res.message);
                               var html = "";
                               for (var i = 0; i < keys.length; i++) {
                                   var message = res.message[keys[i]];
                                   var s = "<i class='errorlist'>"+message+"</i>";
                                   html += s;
                               }
                               $('#error-message').html(html);
                           }
                       }
                   });
                });

        // <!--Delete getting-->
        function ndel(ref) {
           var u = $(ref).attr('data-url');
           $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function nDSubmit(ref){
            var u = $(ref).attr('data-url');
            $.ajax({
                 type:"DELETE",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 }
            })
            .done(function( msg ) {
            console.log(msg);
            newletterRedirecting();
            });
        }