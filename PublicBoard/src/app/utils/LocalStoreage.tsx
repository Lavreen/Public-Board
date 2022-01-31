import SQLite from 'react-native-sqlite-storage'
import { Friend } from '../redux/FriendsReducer';
import { Message } from "../redux/MessagesReducer";

export default class LocalStorage {

    static instance: LocalStorage | null = null;
    _db: SQLite.SQLiteDatabase | null = null;

    static async getStorage(dbkey: string) {
        if (this.instance == null) {
            this.instance = new LocalStorage();
            this.instance._db = await SQLite.openDatabase({ name: 'PublicBoardDB', location: 'default', key: dbkey });
            await this.instance._db
                .transaction(async (tx) => {
                    await tx.executeSql(
                        `
                        CREATE TABLE IF NOT EXISTS friends(
                            pubKey      TEXT NOT NULL PRIMARY KEY,
                            nickname        TEXT NOT NULL,
                            id          INTEGER
                        );
                        `
                    );
                    await tx.executeSql(
                        `
                        CREATE TABLE IF NOT EXISTS messages(
                            id          INTEGER PRIMARY KEY,
                            timestamp   TEXT,
                            dest        TEXT,
                            source      TEXT,
                            self        INTEGER,
                            message     TEXT,
                            FOREIGN KEY(source) REFERENCES friends(pubkey)
                        );
                        `
                    );
                    await tx.executeSql(
                        `
                        INSERT INTO friends (id, pubKey, nickname) VALUES (1, "unknown", "Unknown Source");                        
                        `
                    );
                    await tx.executeSql(
                        `
                        INSERT INTO friends (id, pubKey, nickname) VALUES (2, "self", "You");
                        `
                    )
                })
            return this.instance;
        } else {
            return this.instance;
        }
    }

    static dropStorage(dbkey: string) {
        return new Promise<void>((resolve, reject) => SQLite.deleteDatabase(
            { name: 'PublicBoardDB', location: 'default', key: dbkey },
            () => {
                console.log('Database deleted');
                resolve();
            },
            error => {
                console.log("Database delete ERROR: " + error);
                reject();
            }
        ));


    }

    async saveMessage(id: number, timestamp: string, dest: string, source: string, self: boolean, message: string) {
        await this._db?.transaction(
            async (tx) => {
                await tx.executeSql(
                    'INSERT INTO messages (id, timestamp, dest, source, self, message) VALUES (?,?,?,?,?,?);',
                    [id, timestamp, dest, source, self, message]
                );
            }
        )
    }

    async checkPubKey(pubKey: string) {
        return new Promise<number>(async (resolve, reject) => {
            await this._db?.transaction(
                async (tx) => {
                    tx.executeSql(
                        'SELECT COUNT(*) as IfExists FROM friends WHERE pubKey = ?;',
                        [pubKey],
                        (tx, results) => {
                            resolve(results.rows.item(0).IfExists)
                        },
                        (error) => {
                            console.log("Database pubKey select error", error);
                            reject(error)
                        }
                    )
                }   
            )
            
        })
    }
    

    async saveFriend(pubKey: string, name: string) {
        return new Promise<number>(async (resolve, reject) => {
         let lastId: number
         await this._db?.transaction(
            async (tx) => {
                
                tx.executeSql(
                    'SELECT id FROM friends ORDER BY id DESC LIMIT 1;',
                    [],
                    (tx, results) => {
                        lastId = results.rows.item(0).id+1
                        tx.executeSql(
                            'INSERT INTO friends (id, pubKey, nickname) VALUES (?, ?,?);',
                            [lastId, pubKey, name],
                        );
                        resolve(lastId)
                    },
                    (error) => {
                        console.log("Database id select error", error);
                        reject(error)
                    }
                ) 
            }
        )
        })
    }

    async deleteFriends(friendsToDel: Array<number>) {
         await this._db?.transaction(
            async (tx) => {
                
                friendsToDel.forEach(
                    (id) => {
                        tx.executeSql(
                            'DELETE FROM friends WHERE id = ?;',
                            [id],
                        ); 
                    }
                )
            }
        )
    }

    async editFriend(friend: Friend) {
        await this._db?.transaction(
           async (tx) => {
               
               tx.executeSql(
                   'UPDATE friends SET nickname = ?, pubKey = ? WHERE id = ?;',
                   [friend.nickname, friend.pubKey, friend.id],
               ); 
           }
       )
   }

    getMessages(dest: string | null) {
        return new Promise<Array<Message>>((resolve, reject) => {
            this._db?.transaction((tx) => {
                if (dest == null) {
                    tx.executeSql(
                        `
                        SELECT messages.id, timestamp, nickname, self, message 
                        FROM messages INNER JOIN friends ON messages.source=friends.pubkey
                        ORDER BY messages.id;
                        `,
                        [],
                        (tx, results) => {
                            let messages: Array<Message> = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                let item = results.rows.item(i)
                                console.log(item)
                                messages.push({
                                    id: item.id,
                                    data: null,
                                    timestamp: item.timestamp,
                                    dest: 'board',
                                    source: item.nickname,
                                    message: item.message,
                                    self: item.self
                                });
                            }
                            resolve(messages)
                        },
                        (error) => {
                            console.log("Database load error", error);
                            reject(error)
                        }
                    );
                } else {
                    tx.executeSql(
                        `
                        SELECT messages.id, timestamp, nickname, self, message 
                        FROM messages INNER JOIN friends ON messages.source=friends.pubkey
                        WHERE dest=? ORDER BY messages.id;
                        `,
                        [dest],
                        (tx, results) => {
                            let messages: Array<Message> = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                let item = results.rows.item(i)
                                //todo add user to Message type to distinct user messages
                                messages.push({
                                    id: item.id,
                                    data: null,
                                    timestamp: item.timestamp,
                                    source: item.nickname,
                                    dest: dest,
                                    message: item.message,
                                    self: item.self
                                });
                            }
                            resolve(messages)
                        },
                        (error) => {
                            console.log("Database load error");
                            reject(error)
                        }
                    );
                }
            }
            )
        });
    }

    getFiends() {
        return new Promise<Array<Friend>>((resolve, reject) => {
            this._db?.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM friends WHERE id > 2 ORDER BY nickname ASC;',
                    [],
                    (tx, results) => {
                        let friends: Array<Friend> = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            friends.push(results.rows.item(i));
                        }
                        resolve(friends)
                    },
                    (error) => {
                        console.log("Database load error");
                        reject(error)
                    }
                );
            }
            )
        });
    }
}