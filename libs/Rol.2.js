$(document).ready(function() {
    const buttonStyle = 'z-index: 99;background-color:rgb(61,135,245);padding:10px;color:white;border-radius:10px;border:none;';
    const buttonClasses = 'button-text button button-flex clickable dark';
    const panelStyle = 'bottom: 50px; display:none; position: fixed; background-color: white; padding: 20px; border: 1px solid; color: #0000004f; border-radius: 10px; padding-top: 5px;';
    const buttonSupport = ' position: fixed;bottom: 20px;';
    const leftPanelStyle = 'z-index: 11; box-shadow: 0px -1px 5px 0px rgb(0 0 0 / 27%);';
    const data = init();
    renderTracker();
    clickEvents(); 
  
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
          `<div class="ctr-element" style="white-space: nowrap; position: relative;">
            <div class="ctr-fixed-space" style="display: inline-block; padding: 1px;position:sticky; left:0; background-color: white;">
              <span style="cursor: pointer; padding-right: 10px;">&#9776;</span>
              ${/*<span class="open-npc" style="cursor: pointer;font-size: 18px;font-weight: bold;">⚀</span>*/''}
              <input type="radio" class="tracker-turn" name="turn" value="${i}">
              <input type="text" class="ctr-name" placeholder="Nombre" value="${pj.name}"/>
            </div>
            <input type="text" style="width: 30px;" class="ctr-uEstres" placeholder="UE" title="UE (${(+pj.status.uEstres+6) + ', ' + (+pj.status.uEstres+12) + ', ' + (+pj.status.uEstres+18)})" value="${pj.status.uEstres}"/>
            <input type="text" style="width: 30px;" class="ctr-uDaño" placeholder="UD" title="UD (${(+pj.status.uDaño+6) + ', ' + (+pj.status.uDaño+12) + ', ' + (+pj.status.uDaño+18)})" value="${pj.status.uDaño}"/>
            <div class="ctr-status" style="display: inline-block;margin-bottom: 2px;">
                <select style="height: 25px; name="Estrés" id="estres" title="Estrés: 3 + BV (+6, +12, +18)">
                  ${getOption(0, 'estres', 'Sin obstaculos')}
                  ${getOption(1, 'estres', 'En peligro')}
                  ${getOption(2, 'estres', '- 1 lvl hab')}
                  ${getOption(3, 'estres', '- 2 lvl hab')}
                  ${getOption(4, 'estres', '- 3 lvl hab')}
                  ${getOption(5, 'estres', '¡Incapacitado!')}
              </select>
              <select style="height: 25px; name="daño" id="daño" title="Daño: BF + Mod Umbral daño (+6, +12, +18)">
                  ${getOption(0, 'daño', 'Ileso')}
                  ${getOption(1, 'daño', 'H Leves')}
                  ${getOption(2, 'daño', 'H Moderadas')}
                  ${getOption(3, 'daño', 'H Serias')}
                  ${getOption(4, 'daño', 'H Graves')}
                  ${getOption(5, 'daño', '¡Muerto!')}
              </select>
            </div>
            <input type="text" class="ctr-notes" placeholder="Notas" value="${pj.notes}"/>
            <button style="${buttonStyle} padding: 8px; background-color: rgb(255,54,51); padding-top: 4px; padding-bottom: 4px; display: inline-block;" class="ctr-delete ${buttonClasses}" index="${i}">D</button>
          <div style="display:none;padding-left: 50px;" class="npc-data">${getNPCPanel(pj)}</div>
        </div>`
        );
      });
  
      $('.ctr-status span').tooltip();
        

      $('.open-npc').click(el => {
        const current = $(el.currentTarget);
        const row = $(current.parent());
        current.text() === '⚅' ? current.text('⚀') : current.text('⚅');
        row.find('.npc-data').slideToggle();
      });
  
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
            saveReloadTracker();
          }
        }
      });
  
      $('.tracker-turn').click(el => {
        data.combat.hasTurn = +$(el.currentTarget).val();
      });
  
      $('input:radio[name=turn]').filter(`[value="${data.combat.hasTurn}"]`).click();
    }
    
    function saveReloadTracker() {
      saveData();
      renderTracker();
    }
  
    function newTracker() {
      return JSON.parse(JSON.stringify({
        name: '',
        status: {
            uDaño: '',
            uEstres: '',
            estres: 0,
            daño: 0
        },
        notes: ''
      }));
    }
  
    function saveData() {
      $(".ctr-element").each(function(tr) {
          data.combat.trackers[tr] = {
              name: findVal(this,".ctr-name",''),
              status: {
                  uDaño: findVal(this,".ctr-uDaño", ''),
                  uEstres: findVal(this,".ctr-uEstres", ''),
                  daño: +findVal(this,"#daño", 0),
                  estres: +findVal(this,"#estres", 0)
              },
              notes: findVal(this,".ctr-notes",'')
          }
      });
      data.combat.turn = +$('#combat-turn').val() || 0;
      data.notes = $('#cti-notes').val() || '';
      localStorage.setItem('rpg-data', JSON.stringify(data));
    }
  
    function clickEvents() {
        $('#blink').click(() => {
            $.get( 'https://maker.ifttt.com/trigger/broadlink/json/with/key/di9nDVRCT28-1wX1ENqwt_')
        });
        
        $('#combat-restart').click(() => {
            data.combat.hasTurn = 0;
            data.combat.turn = 0;
            $('#combat-turn').val(0);
            saveReloadTracker();
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
            saveData();
        });
    
        $('#ctb-combat').click(() => {
            $('#ctp-combat').slideToggle();
            saveData();
        $(".ctr-list").sortable();
        });
    
        $('#ctb-new').click(() => {
            data.combat.trackers.push(newTracker());
            saveReloadTracker();
        });
    }
  
    function findVal(ctx, str, def) {
        return $(ctx).find(str).val() || def;
    }

    function init() {
        let loadedData;
        try {
          loadedData = JSON.parse(localStorage.getItem('rpg-data'));
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
        $('body').append(
          `<button id="ctb-combat" style="left: 10px;${buttonStyle+buttonSupport}" class="">Combate</button>`,
          `<button id="ctb-notes" class="${buttonClasses}" style="right: 10px;${buttonStyle+buttonSupport}">Notas</button>`,
          //`<button id="blink" style="right: 100px;${buttonStyle+buttonSupport}" class="">B Link</button>`,
          `<div id="ctp-notes" style="z-index: 11;right: 10px; box-shadow: -1px -1px 5px 0px rgb(0 0 0 / 27%); ${panelStyle}"><span style="color: #000000bd;">Notas</span><textarea style="display:block;" class="tracker-elements" id="cti-notes" rows="4" cols="50" placeholder="Notas">${data.notes}</textarea></div>`,
          `<div id="ctp-combat" style="max-width: 790px; min-width: 280px; width: -webkit-fill-available;width: -moz-fill-available;left: 10px; ${leftPanelStyle+panelStyle}"><button class="${buttonClasses}" style="${buttonStyle} padding-top: 7px; padding-bottom: 7px; margin-right:20px; background-color: rgb(44,171,33); display: inline-block;" id="ctb-new">+</button><div style="position: absolute; right: 20px; top: 7px;"><button id="combat-restart" style="${buttonStyle} margin-right: 10px;  padding-top: 7px; padding-bottom: 7px; display: inline-block; background-color: rgb(255,54,51);" class="${buttonClasses}">Reset</button><span style="color: #000000bd;">Turn: <input type="number" style="width: 50px;" id="combat-turn" value="${data.combat.turn}" placeholder="Turno"></span><button id="combat-next" style="${buttonStyle} margin-left: 10px; padding-top: 7px; padding-bottom: 7px; display: inline-block;" class="${buttonClasses}">Siguiente</button></div><div style="color: #000000bd; margin-top: 20px; max-height: 300px; overflow: auto;" class="ctr-list"></div></div>`,
		      '<style>.ctr-list::-webkit-scrollbar-track{background-color:#F5F5F5;} .ctr-list::-webkit-scrollbar-thumb{border:none;background-color: lightgrey}</style>'
		);
        return data;
    }

    function getNPCPanel(pj) {
        return `
            <button id="npc-generate" style="${buttonStyle} margin-left: 10px; padding-top: 7px; padding-bottom: 7px; display: inline-block;" class="${buttonClasses}">Generar</button>
            <span class="npc-arquetipo"> 
                <select name="arquetipo" style="padding: 5px;margin-left: 10px;">
                    <option value="value1">Value 1</option>
                    <option value="value1">Value 1</option>
                    <option value="value1">Value 1</option>
                    <option value="value1">Value 1</option>
                    <option value="value1">Value 1</option>
                </select>
            </span>
            <div class="npc-attr"></div>
            <div class="npc-habilidades"></div>
            <div class="npc-rasgos"></div>
            <div class="npc-talentos"></div>
            <div class="npc-caos"></div>
        `;
    }

    function getNewNPC(raze, type) {
        /*const calculated = 'iniciativa, movimiento, umbral daño, umbral estres, parar, esquivar';
        const listaTalentosPorTipo;
        const listaRasgosProfesion;
        const listaRasgosRaza;
        const listaHechizos;
        const manchaCaos;
        const ataque+armas?;
        const arquetipo;
        const listaMarcasDistintivas?;

        return {
            attributesANDavances: {
                bc,
                bf,
                ba,
                bp,
                bi,
                bv,
                be
            }
            habilidadesRangos: {
                ...habilidades
            }
        }*/
    }
});