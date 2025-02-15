import { html, render, nothing } from "lit-html"
import {Idea, Model, Room, store} from "../../model"
import ideaService from "../../service/idea-service"
import {distinctUntilChanged, map} from "rxjs";


class TextInputElement extends HTMLElement {


    template(isInRoom:boolean, isRoomStarted:boolean, canAddIdeas:boolean) {
        if (isInRoom == false) {
            return nothing;
        }
        return html`
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #fff !important;
            }
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                margin-top: 10vh;
            }
            .styled-input {
                width: 100%;
                max-width: 1070px;
                height: 60px;
                background-color: #8D63D0;
                color: #fff;
                border: 5px solid #9D75EF;
                box-sizing: border-box;
                font-size: 16px;
                padding: 0 10px;
                outline: none;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .send-button {
                background-color: white;
                width: 100%;
                max-width: 240px;
                height: auto;
                text-align: center;
                font-family: 'sans-serif';
                margin-bottom: 20px;
                border-radius: 10px;
                cursor: pointer;
            }
            .send-button h2 {
                user-select: none;
            }
            @media (max-width: 600px) {
                .styled-input {
                    font-size: 14px;
                    padding: 0 8px;
                }
                .send-button {
                    max-width: 100%;
                }
            }
        </style>

        <div class="container">
            <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
            <input type="text" class="styled-input" name="" .disabled="${(!(isRoomStarted && canAddIdeas))}" placeholder="${(isRoomStarted?(canAddIdeas?"enter new idea":"maximum number of ideas added"):"wait till room is started")}">
            <!-- does not work properly {((isRoomStarted && canAddIdeas)?"display: flex;":"")} flex-wrap: wrap;-->
            <div @click= "${() => this.onButtonClick()}" .hidden="${!isRoomStarted}" 
                 style="background-color: ${(canAddIdeas?"white":"grey")}; width: 20vw; height: auto; 
                 justify-content: space-around; text-align: center; 
                 font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                <h2 style="user-select: none">${(canAddIdeas)?"Send":"No More Ideas"}</h2>
        </div>
        `
    } 

    onButtonClick(){
        const input = this.shadowRoot.querySelector('input').value

        if (input !== "") {
            const model : Model = store.getValue();

            const idea : Idea = {
                roomId : model.activeRoomId,
                memberId: model.thisUserId,
                content: input
            }

            this.shadowRoot.querySelector('input').value = "";
            ideaService.postNewIdea(idea);
        }
    }

    constructor(){
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        store.pipe(map(model => ({
            ideas: model.ideas,
            rooms: model.rooms,
            activeRoomId: model.activeRoomId,
            thisUserId: model.thisUserId
        })),distinctUntilChanged())
            .subscribe(reduced_model => {
            //console.log(model);
            const thisRooms = reduced_model.rooms.filter((room)=> room.roomId===reduced_model.activeRoomId);
            //console.log(thisRoom);
            let thisRoom: Room = null;
            let thisRoomStarted = false;
            let canAddIdeas : boolean = false;
            if (thisRooms.length==1){
                thisRoom = thisRooms[0];
                thisRoomStarted = (thisRoom.roomState==="STARTED");

                let ideas_of_this_user = reduced_model.ideas.filter((idea)=> idea.memberId===reduced_model.thisUserId && idea.roomId===reduced_model.activeRoomId).length;
                switch (thisRoom.type) {
                    case "brainstormingroom":
                        canAddIdeas=true;
                        // nothing to do
                        break;

                    case "brainwritingroom": // permit only three ideas for user
                        canAddIdeas = ideas_of_this_user < 3;
                        break;

                    default:
                        break;
                }


            }

            render(this.template(reduced_model.activeRoomId!=="", thisRoomStarted, canAddIdeas), this.shadowRoot);
        });
    }

}

customElements.define("text-input", TextInputElement);
