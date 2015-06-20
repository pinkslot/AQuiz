"use strict";

var BaseServer = $.inherit({
    __constructor: function(q) {
        this.quiz = q;
        q.server = this;
    },

    _parseArgs: function () {
        var args = {};
        $.each(document.location.search.substring(1).split(/[&;]/), function(i, s) {
            if (s === '') return;
            s = decodeURIComponent(s);
            var np = s.indexOf('=', s);
            if (np < 0)
                args[s] = null;
            else
                args[s.substring(0, np)] = s.substring(np + 1);
        });
        return args;
    },

    _makeArgs: function(names, name_value) {
        var a = $.map(names, function(name, i) {
            return ';' + name + '=' + name_value[name];
        });
        return a.join('');
    },

    load_quiz: function() {}
});

var FileServer = $.inherit(BaseServer,
{
    __constructor: function(q) {
        this.__base(q);
        var args = this._parseArgs();
        this.load_url = args.load_url;
        this.submit_url = args.submit_url;
    },

    load_quiz: function() {
        var that = this;
        $.ajax({
            url: that.load_url,
            dataType: 'json',
            timeout: 10000,
            success: function(quizJSON) {
                that.quiz.init(quizJSON);
            },
            error: function(req, textStatus, err) {
                req.abort();
                setTimeout(function(serv) { serv.load_quiz(); }, 4000, that);
            },
        });
    }

});

var CatsServer = $.inherit(BaseServer,
{
    __constructor: function(q) {
        this.__base(q);
        var args = this._parseArgs();
        this.pid = args.pid;
        this.default_args = this._makeArgs(['sid', 'cid'], args);
    },

    _makeCatsUrl: function(f, args) {
        var url = '/cats/main.pl?f=' + f + this.default_args + this._makeArgs(Object.keys(args), args);
        return url;
    },

    _submitRequest: function(param) {
        var that = this;
        var formData = new FormData();

        $.each($.extend(param, { submit: 'submit', problem_id: this.pid }),
            function(k, v) { formData.append(k, v); }
        );

        $.ajax({
            async: false,
            url: this._makeCatsUrl('problems', { json: 1 }),
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData,
            success: function(data) {
                if (param.generating_req) { that.rid = data.rid; }
                console.log(data.message);
            },
            error: function(req, textStatus, err){
                req.abort();
                alert($('#serverFail') + '\n' + err);
            }
        });
    },

    load_quiz: function() {
        var that = this;
        if (!this.rid) { this._submitRequest({ source_text: 'dummy', generating_req: 1, de_id: 10 }); }
        $.ajax({
            async:false,
            type:"GET",
            url: this._makeCatsUrl('download_source', { rid: that.rid }),
            crossDomain: true,
            datatype : "application/json",
            contentType: "text/json",
            src_enc: 'UTF-8',
            success: function(data){
                that.quiz.init(data);
            },
            error: function(req, textStatus, err) {
                req.abort();
                setTimeout(function(serv) { serv.load_quiz(); }, 4000, that);
            },
        });
    },

    submit_answer: function(ans) {
        var that = this;
        if (!this.rid) { console.log('Submit answer before laod quiz'); return; }
        this._submitRequest({ source_text: ans.join('\n') + '\n', de_id: 772264 });        // de_id - answer text
    },

});
