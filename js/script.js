var editing = 0;
var lastudpdate;
var editingnote=-1;
function updateidhead(el)
{
    editingnote = el.id.substr(3);
}
function updateident(el)
{
    editingnote = el.id.substr(5);
}

window.onbeforeunload = function(){
    if(editing!=0){
        return 'We are still attempting to save something...';
    }
};

function updatenote(){
    // $('#lastupdated'+editingnote).html('Saving...');
    var headi = document.getElementById("inp"+editingnote).value;
    var ent = $("#entry"+editingnote).html();
    var entcontent = $("#entry"+editingnote).text();
    // console.log(ent);
    // alert(ent);
    $.post( "updatenote.php", {pass: app_pass, id: editingnote, heading: headi, entry: ent, entrycontent: entcontent, now: (new Date().getTime()/1000)-new Date().getTimezoneOffset()*60})
    .done(function(data) {
        if(data=='1')
        {
            editing = 0;
            $('#lastupdated'+editingnote).html('Last Saved Today');
        }
        else
        {
            editing = 0;
            $('#lastupdated'+editingnote).html(data);
        }
    });
    $('#newnotes').hide().show(0);
}

function newnote(){
    $.post( "insertnew.php", {pass: app_pass, now: (new Date().getTime()/1000)-new Date().getTimezoneOffset()*60})
    .done(function(data) {
        if(data=='1') 
        {
            $(window).scrollTop(0);
            location.reload(true);
        }
        else alert(data);
    });
}

function save(){
    alert('saved');
}

function checkedit(){
    if(editingnote==-1) return ;

    var curdate = new Date();
    var curtime = curdate.getTime();
    if(editing==1 && curtime-lastudpdate > 1000)
    {
        updatenote();
    }
}

function deletePermanent(iid){
    var r = confirm("Are you sure you want to permanently delete the note "+document.getElementById("inp"+iid).value+"?. This action can't be undone.");
    if (r == true) {
        $.post( "permanentDelete.php", {pass: app_pass, id:iid})
        .done(function(data) {
            if(data=='1') $('#note'+iid).hide();
            else alert(data);
        });
    }
}

function putBack(iid){
    $.post( "putback.php", {pass: app_pass, id:iid})
    .done(function(data) {
        if(data=='1') $('#note'+iid).hide();
        else alert(data);
    });
}

function deleteNote(iid){
    var r = confirm("Are you sure you want to delete the note "+document.getElementById("inp"+iid).value+"?");
    if (r == true) {
        $.post( "deletenote.php", {pass: app_pass, id:iid})
        .done(function(data) {
            if(data=='1') $('#note'+iid).hide();
            else alert(data);
        });
    }
}

function update(){
    if(editingnote=='rch') return;
    editing = 1;
    var curdate = new Date();
    var curtime = curdate.getTime();
    lastudpdate = curtime;
    // alert(lastudpdate);
    $('#lastupdated'+editingnote).html('Saving...');
}

$('body').on( 'keyup', '.noteentry', function (){
    update();
});

$('body').on( 'click', '.popline-btn', function (){
    update();
});

$('body').on( 'keyup', 'input', function (){
    update();
});


$( document ).ready(function() {
    setInterval(function(){ checkedit(); }, 1000);
});
