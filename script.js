function copyTrueLetter(activeRow)
{
    $(".true-letter").each(function(){
        activeRow.find(".letter").eq($(this).index()).text($(this).text()).addClass("true-letter");
    });
}
function cursorMove(direction,nextRow)
{
    var activeIndex = $(".active-letter").index();
    var activeRow = $(".active-letter").parents("[data-row]").first();
    if ((!nextRow && activeIndex < 4) || (nextRow || direction == -1)) {
        activeRow.find(".letter").eq(activeIndex).removeClass("active-letter");
    }
    var newLetter = activeRow.find(".letter").eq(activeIndex+direction);
    if (newLetter.length > 0) {
        newLetter.addClass("active-letter");
        if (newLetter.hasClass('true-letter')) {
            cursorMove(direction,nextRow);   
        }
    } else if(nextRow) {
        $("[data-row]").eq(activeRow.index()+direction).find(".letter").first().addClass("active-letter");
        copyTrueLetter($("[data-row]").eq(activeRow.index()+direction));
        if ($(".active-letter").hasClass("true-letter")) {
            cursorMove(direction,nextRow);
        }
    } else {
        /*activeRow.find(".letter").eq(activeIndex).removeClass("active-letter");
        activeRow.find(".letter").first().addClass("active-letter");*/
    }
}
function getRowText()
{
    var activeRow = $(".active-letter").parents("[data-row]").first();
    var writtenText = "";
    activeRow.each(function(){
        $(this).find(".letter").each(function(){
            if ( $(this).text() != "") {
                writtenText+=$(this).text();
            }
        });
    });
    return writtenText;
}
function checkWord(selectedWord)
{
    var activeIndex = $(".active-letter").index();
    var activeRow = $(".active-letter").parents("[data-row]").first();
    var writtenText = getRowText();
    if (words.indexOf(writtenText.toLocaleLowerCase()) > -1) {
        activeRow.each(function(){
            
            $(this).find(".letter").each(function(){
                if ( $(this).text() != "") {
                    if ($(this).text() == selectedWord[$(this).index()]) {
                        $(this).addClass("true-letter");
                    } else if(selectedWord.indexOf($(this).text()) >= 0) {
                        $(this).addClass("true-other-letter");
                    } else {
                        $(this).addClass("false-letter");
                    }
                }
            });
            if(writtenText == selectedWord) {
                $(".active-letter").removeClass("active-letter");
                $("body").addClass("success");
                
            } else {
                cursorMove(1,true);
            }
            
        });
    } else {
        activeRow.find(".letter:not(.true-letter)").text('');
        activeRow.find(".letter:not(.true-letter)").removeClass('active-letter filled-letter');
        activeRow.find(".letter:not(.true-letter)").first().addClass('active-letter');
    }
}
function heh(e,selectedWord,gameType)
{
    if (!e.ctrlKey) {
        if ((gameType == "word" && /(^[a-zA-ZğüşöçİiıĞÜŞÖÇ]{1})$(.*)/.test(e.key)) || (gameType == "number" && /(^[0-9]{1})$(.*)/.test(e.key))) {
            $(".active-letter").text(e.key.toLocaleUpperCase()).addClass('filled-letter');
            cursorMove(1,false);
        } else if(e.keyCode == 8) {
            $(".active-letter").text('');
            cursorMove(-1,false);
        } else if(e.keyCode == 13 && getRowText().length == 5) {
            checkWord(selectedWord);
        } else if(e.keyCode == 37) {
            cursorMove(-1,false);
        } else if(e.keyCode == 39) {
            cursorMove(1,false);
        } 
    }
}
$(function(){
    var language = ["en","tr"].indexOf(navigator.language) >= 0 ? navigator.language : "en";

    var alphabetScript = document.createElement('script');
    alphabetScript.src = "alphabet-"+language+".js";
    document.head.appendChild(alphabetScript);
    alphabetScript.onload = function () {
        var script = document.createElement('script');
        script.src = "words-"+language+".js";
        document.head.appendChild(script);
        script.onload = function () {
            var gameType = localStorage.getItem('gametype') || 'word';
            $(".game-type:checked").prop('checked', false);
            $(".game-type[value="+gameType+"]").prop('checked', true);
            if (gameType != "word") {
                words = [];
                for (var i = 10000; i <= 99999; i++) {
                    words.push(i.toString());
                }
                for (let index = 0; index <= 9; index++) {   
                    $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-secondary">'+index+'</div>');
                }
            } else {
                $.each(alphabet,function(key,alpa){
                    $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-secondary">'+alpa+'</div>');
                });
                $("#total").hide();
            }
            $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-info">LEFT</div>');
            $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-info">RIGHT</div>');
            $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-danger">DEL</div>');
            $("#alphabet").append('<div class="alphabet-box flex-fill rounded m-1 py-2 px-3 alert-success">ENTER</div>');

            var selectedIndex = Math.floor(Math.random() * words.length);
            var selectedWord =  words[selectedIndex].toLocaleUpperCase();
            var setting = {
                helpCount:1
            };
            console.log(selectedWord);
            setTimeout(() => {
                $(".text").addClass("paused");    
            }, 6500);
            $(".game-type").change(function(){
                localStorage.setItem('gametype',$(this).val());
                window.location.reload();
            });
            $("#total").text(selectedWord.split('').reduce(function(a,b){ return parseInt(a)+parseInt(b); }, 0));
            
            $(document).on("keyup",function(e){
                heh(e,selectedWord,gameType);
            });
            $(".alphabet-box").click(function(){
                var e = {};
                e['key'] = $(this).text();
                if (e['key'] == 'ENTER') {
                    e['keyCode'] = 13;
                } else if (e['key'] == 'DEL') {
                    e['keyCode'] = 8;
                } else if (e['key'] == 'LEFT') {
                    e['keyCode'] = 37;
                } else if (e['key'] == 'RIGHT') {
                    e['keyCode'] = 39;
                } else {
                    e['keyCode'] = $(this).text().toLocaleUpperCase().charCodeAt(0);
                }
                heh(e,selectedWord,gameType);

            });
            $(".help-me").click(function(){
                if (setting.helpCount > 0) {
                    var selectedIndex = Math.floor(Math.random() * 5);
                    var helpedLetter = $(".active-letter").parents("[data-row]").first().find(".letter").eq(selectedIndex);
                    helpedLetter.text(selectedWord[selectedIndex]).addClass('true-letter');
                    setting.helpCount = 0;
                }
            });
        }
    }
});