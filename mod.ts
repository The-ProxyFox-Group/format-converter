let systems = JSON.parse(Deno.readTextFileSync("./systems.json"))
let roles = JSON.parse(Deno.readTextFileSync("./roles.json"))

let output: {
    schema: number,
    systems: {
        [id: string]: any
    },
    users: {
        [id: string]: {
            system: string
        }
    },
    servers: {
        [id: string]: {
            role: string
        }
    }
} = {
    "schema": 1,
    "systems": {},
    "users": {},
    "servers": {}
}

let i = 0;
for (let j in systems) {
    let system = systems[j]
    let id = toPkString(i);
    let obj = {
        id,
        accounts: [j],
        name: system.name,
        description: system.description,
        tag: system.tag,
        avatarUrl: system.avatar_url,
        timestamp: system.created,
        autoType: system.auto_bool? "latch": undefined,
        members: {},
        serverProxy: {},
        proxyTags: [],
        switches: {}
    }


    let k = 0;
    for (let l in system.members) {
        let member = system.members[l]
        let memid = toPkString(k)
        //@ts-ignore
        obj.members[memid] = {
            id: memid,
            name: member.name,
            displayName: member.dispaly_name,
            description: member.description,
            birthday: member.birthday,
            pronouns: member.pronouns,
            color: member.color,
            avatarUrl: member.avatar_url,
            keepProxy: member.keep_proxy,
            messageCount: member.message_count,
            timestamp: member.created,
            serverDisplayName: member.server_nick,
            serverAvatarUrl: member.server_avatar,
            serverProxy: member.server_proxy
        }
        for (let m in member.proxy_tags) {
            let proxy = member.proxy_tags[m]
            proxy.member = memid
            obj.proxyTags.push(<never>proxy)
        }
        k++
    }
    output.systems[id] = obj
    output.users[j] = {
        system: id
    }
    i++
}

for (let p in roles) {
    output.servers[p] = {
        role: roles[p]
    }
}

Deno.writeTextFileSync("./systems_output.json", JSON.stringify(output))

function toPkString(i: number): string {
    let temp = Math.floor(i)
    let out = ""
    while (temp > 0) {
        out += String.fromCharCode(97 + (temp%26))
        temp /= 26
        temp = Math.floor(temp)
    }
    out += "a".repeat(5-out.length)
    return out.split("").reverse().join("")
}