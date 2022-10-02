const systems = JSON.parse(Deno.readTextFileSync("./systems.json").replaceAll("\\u0000", ""))
const roles = JSON.parse(Deno.readTextFileSync("./roles.json").replaceAll("\\u0000", ""))

const output: {
    schema: number,
    systems: {
        [id: string]: never
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

const validIdRegex = /^[a-z]{5}$/

for (const j in systems) {
    const system = systems[j]
    let id = system.id;
    if (!validIdRegex.test(id)) {
        id = generateRandomId()
    }
    while (output.systems[id] != undefined) {
        id = generateRandomId()
    }
    const obj = {
        id,
        accounts: [j],
        name: system.name == "" ? undefined : system.name,
        description: system.description == "" ? undefined : system.description,
        tag: system.tag == "" ? undefined : system.tag,
        avatarUrl: system.avatar_url == "" ? undefined : system.avatar_url,
        timestamp: system.created == "" ? undefined : system.created,
        autoType: system.auto_bool? "latch": undefined,
        members: {},
        serverProxy: system.server_proxy,
        proxyTags: [],
        switches: []
    }

    for (const l in system.members) {
        const member = system.members[l]
        let memid = member.id
        if (!validIdRegex.test(memid)) {
            memid = generateRandomId()
        }
        //@ts-ignore aaaaaaaaaaaaaaaaaaaaaaaaaa
        while (obj.members[memid] != undefined) {
            memid = generateRandomId()
        }
        //@ts-ignore technically doesn't exist in type
        obj.members[memid] = {
            id: memid,
            name: typeof member.name != "string" || member.name == "" ? memid : member.name,
            displayName: member.dispaly_name == "" ? undefined : member.displayName,
            description: member.description == "" ? undefined : member.description,
            birthday: member.birthday == "" ? undefined : member.birthday,
            pronouns: member.pronouns == "" ? undefined : member.pronouns,
            color: member.color == "" ? undefined : member.color,
            avatarUrl: member.avatar_url == "" ? undefined : member.avatar_url,
            keepProxy: member.keep_proxy,
            messageCount: member.message_count,
            timestamp: member.created == "" ? undefined : member.timestamp,
            serverDisplayName: member.server_nick,
            serverAvatarUrl: member.server_avatar,
            serverProxy: member.server_proxy
        }
        for (const m in member.proxy_tags) {
            const proxy = member.proxy_tags[m]
            obj.proxyTags.push(<never>proxy)
        }
    }
    console.log(obj)
    output.systems[id] = <never>obj
    output.users[j] = {
        system: id
    }
}

for (const p in roles) {
    output.servers[p] = {
        role: roles[p]
    }
}

Deno.writeTextFileSync("./systems_output.json", JSON.stringify(output))

function generateRandomId(): string {
    let out = ""
    for (let i = 0; i < 5; i++) {
        out += String.fromCharCode(random(0,26)+97)
    }
    return out
}

function random(min: number, max: number) {
    return Math.random() * (max - min) + min
}
