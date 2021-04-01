const users=[];

const addUser=({id, username, room})=>{

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const user = {
        id,
        username,
        room
    }

    //validate data
    if(!username || !room){
        return {
            error:"room/username is required"
        }
    }

    //check for unique data
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    });
    //validate username
    if(existingUser){
        return {
            error:"the user already exists!"
        }
    }

    users.push(user);
    return {user}

}

const removeUser =(id)=>{

   const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser=(id)=>{
    console.log("users list:",users);
   return users.find((user) => user.id === id)
}

const getUsersInRoom =(room)=>{

    const usersInRoom = [];
    users.find((user)=>{
        if(user.room === room){
            usersInRoom.push(user);
        }
    })
    if(usersInRoom.length > 0){
        return usersInRoom;
    }
    return [];
}

module.exports ={
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}