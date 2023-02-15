$(document).ready(function() {
    let loadedData;
    const JP = JSON.parse;
    const JS = JSON.stringify;
    try {
      loadedData = JP(localStorage.getItem('rpg-data'));
    } catch (err) {
      console.warn('RPG TRACKER NEW')
    }
  
    const data = loadedData || {
      combat: {
        turn: 0,
        hasTurn: 0,
        trackers: [newTracker(), newTracker(), newTracker()]
      },
      notes: ''
    };
    const buttonStyle = 'z-index: 99;background-color:rgb(61,135,245);padding:10px;color:white;border-radius:10px;border:none;';
    const buttonClasses = 'button-text button button-flex clickable dark';
    const panelStyle = 'bottom: 50px; display:none; position: fixed; background-color: white; padding: 20px; border: 1px solid; color: #0000004f; border-radius: 10px; padding-top: 5px;';
    const buttonSupport = ' position: fixed;bottom: 20px;';
    $('body').append(
      `<button id="ctb-combat" style="left: 100px;${buttonStyle+buttonSupport}" class="">Combate</button>`,
      `<button id="ctb-notes" class="${buttonClasses}" style="right: 100px;${buttonStyle+buttonSupport}">Notas</button>`,
      `<button id="blink" style="right: 10px;${buttonStyle+buttonSupport}" class="">B Link</button>`,
      `<div id="ctp-notes" style="z-index: 11;right: 100px; box-shadow: -1px -1px 5px 0px rgb(0 0 0 / 27%); ${panelStyle}"><span style="color: #000000bd;">Notas</span><textarea style="display:block;" class="tracker-elements" id="cti-notes" rows="4" cols="50" placeholder="Notas">${data.notes}</textarea></div>`,
      `<div id="ctp-combat" style="z-index: 11;left: 100px; box-shadow: 0px -1px 5px 0px rgb(0 0 0 / 27%); ${panelStyle}"><button class="${buttonClasses}" style="${buttonStyle} padding-top: 7px; padding-bottom: 7px; margin-right:20px; background-color: rgb(44,171,33); display: inline-block;" id="ctb-new">+</button><div style="position: absolute; right: 20px; top: 7px;"><button id="combat-restart" style="${buttonStyle} margin-right: 10px;  padding-top: 7px; padding-bottom: 7px; display: inline-block; background-color: rgb(255,54,51);" class="${buttonClasses}">Reset</button><span style="color: #000000bd;">Turn: <input type="number" style="width: 50px;" id="combat-turn" value="${data.combat.turn}" placeholder="Turno"></span><button id="combat-next" style="${buttonStyle} margin-left: 10px; padding-top: 7px; padding-bottom: 7px; display: inline-block;" class="${buttonClasses}">Siguiente</button></div><div style="color: #000000bd; margin-top: 20px; max-height: 300px; overflow: auto;" class="ctr-list"></div></div>`
    );
  
    renderTracker();
  
    $('#blink').click(() => {
       $.get( 'https://maker.ifttt.com/trigger/broadlink/json/with/key/di9nDVRCT28-1wX1ENqwt_')
    });
    
    $('#combat-restart').click(() => {
      data.combat.hasTurn = 0;
      data.combat.turn = 0;
      $('#combat-turn').val(0);
      saveReload();
    });
    
    $("#combat-next").click(() =>{
        if(data.combat.hasTurn === data.combat.trackers.length-1) {
          data.combat.hasTurn = 0;
          data.combat.turn++;
          $('#combat-turn').val(data.combat.turn);
          renderTracker();
        } else {
          data.combat.hasTurn++;
          renderTracker();
        }
    });
  
    $('#ctb-notes').click(() => {
      $('#ctp-notes').slideToggle();
    });
  
    $('#ctb-combat').click(() => {
      $('#ctp-combat').slideToggle();
      $(".ctr-list").sortable();
    });
  
    $('#ctb-new').click(() => {
      data.combat.trackers.push(newTracker());
      saveReload();
    });
  
    setInterval(() => {
      saveData();
    }, 3000);
  
    function renderTracker() {
      $(".ctr-list").empty();
      data.combat.trackers.forEach((pj, i) => {
          function isSelected(stat, val) {
              return pj.status[stat] == val ? 'selected' : '';
          }
          function getOption(val, type, txt) {
              return `<option value="${val}" ${isSelected(type, val)}>${txt}</option>`;
          }
        $(".ctr-list").append(
          `<div class="ctr-element">
            <span style="cursor: pointer; padding-right: 10px;">&#9776;</span> <input type="radio" class="tracker-turn" name="turn" value="${i}">
            <input type="text" class="ctr-name" placeholder="Nombre" value="${pj.name}"/>
            <input type="number" style="width: 40px;" class="ctr-uestres" placeholder="Umbral Estrés" value="${pj.status.uestres}"/>
            <input type="number" style="width: 40px;" class="ctr-udano" placeholder="Umbral Dano" value="${pj.status.udano}"/>
            <div class="ctr-status" style="display: inline-block;">
                <select name="Estrés" id="estres" title="Estrés: 3 + BV (+6, +12, +18)">
                  ${getOption(0, 'estres', 'Sin obstaculos')}
                  ${getOption(1, 'estres', 'En peligro')}
                  ${getOption(2, 'estres', '- 1 lvl hab')}
                  ${getOption(3, 'estres', '- 2 lvl hab')}
                  ${getOption(4, 'estres', '- 3 lvl hab')}
                  ${getOption(5, 'estres', '¡Incapacitado!')}
              </select>
              <select name="Dano" id="dano" title="Dano: BF + Mod Umbral dano (+6, +12, +18)">
                  ${getOption(0, 'dano', 'Ileso')}
                  ${getOption(1, 'dano', 'H Leves')}
                  ${getOption(2, 'dano', 'H Moderadas')}
                  ${getOption(3, 'dano', 'H Serias')}
                  ${getOption(4, 'dano', 'H Graves')}
                  ${getOption(5, 'dano', '¡Muerto!')}
              </select>
            </div>
            <input type="text" class="ctr-notes" placeholder="Notas" value="${pj.notes}"/>
            <button style="${buttonStyle} background-color: rgb(255,54,51); padding-top: 7px; padding-bottom: 7px; display: inline-block;" class="ctr-delete ${buttonClasses}" index="${i}">D</button>
          </div>`
        );
      });
  
      $('.ctr-status span').tooltip();
  
      $('.ctr-delete').click(el => {
        if ($('.ctr-element').length === 1) {
          alert('Min 1');
        } else {
          if (window.confirm('¿Seguro?')) {
            const index = +$(el.currentTarget).attr('index');
            if (data.combat.hasTurn === index) {
              data.combat.hasTurn = 0;
            }
            data.combat.trackers.splice(index, 1);
            renderTracker();
            saveReload();
          }
        }
      });
  
      $('.tracker-turn').click(el => {
        data.combat.hasTurn = +$(el.currentTarget).val();
      });
  
      $('input:radio[name=turn]').filter(`[value="${data.combat.hasTurn}"]`).click();
    }
    
    function saveReload() {
      saveData();
      renderTracker();
    }
  
    function newTracker() {
      return JP(JS({
        name: '',
        status: {
            udano: 0,
            uestres: 0,
            estres: 0,
            dano: 0
        },
        notes: ''
      }));
    }
  
    function saveData() {
      $(".ctr-element").each(function(tr) {
          data.combat.trackers[tr] = {
              name: findVal(this,".ctr-name",''),
              status: {
                  udano: +findVal(this,".ctr-udano",0),
                  uestres: +findVal(this,".ctr-uestres",0),
                  dano: +findVal(this,"#dano",0),
                  estres: +findVal(this,"#estres",0)
              },
              notes: findVal(this,".ctr-notes",'')
          }
      });
      data.combat.turn = +$('#combat-turn').val() || 0;
      data.notes = $('#cti-notes').val() || '';
      localStorage.setItem('rpg-data', JS(data));
    }
  
      function findVal(ctx, str, def) {
          return $(ctx).find(str).val() || def;
      }
  });