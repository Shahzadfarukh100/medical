
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

            appintmentRedirecting();

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

