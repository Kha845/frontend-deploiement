import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
export default class DialogStore{
    isDialogOpen = false;
    dialogText = 'Etes vous sur';
    private confirm: any = null;

    rootStore: IRootStore;

    constructor(rootStore: IRootStore){

        console.log("DialogStore")
        makeObservable(this,{
           isDialogOpen: observable,
           openDialog: action,
           closeDialog: action,
           confirmAction: action
        })
        this.rootStore = rootStore;
    }
    openDialog = (data: any) =>{
        this.confirm = data.confirm;
        this.dialogText = data.dialogText;;
        this.isDialogOpen = true;
    }
    closeDialog = () =>{
        this.confirm = null;
        this.dialogText = "Etes vous sur de supprimer l'utilisateur";
        this.isDialogOpen = false;
    }
    confirmAction = () =>{

        if(this.confirm)  
            this.confirm();
            this.closeDialog();
    }

}