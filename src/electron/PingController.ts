import { ipcMain, Notification } from 'electron';

class PingController {
    constructor() {
        
    }

    ipcRegiste(): void {
        ipcMain.on('noti-ping', (event, payload) => {
            const notiMsg = {
                titile: payload,
                body: 'ffmpeg 명령 호출'
            }
            
            new Notification(notiMsg).show();
        });
    }
}

export default PingController;