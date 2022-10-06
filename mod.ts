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
    while (output.systems[id] != null) {
        id = generateRandomId()
    }
    const obj = {
        id,
        accounts: [j],
        name: system.name == "" ? null : system.name,
        description: system.description == "" ? null : system.description,
        tag: system.tag == "" ? null : system.tag,
        avatarUrl: system.avatar_url == "" ? null : system.avatar_url,
        timestamp: system.created == "" ? null : system.created,
        autoType: system.auto_bool? "latch": null,
        members: {},
        serverProxy: system.server_proxy,
        proxyTags: [],
        switches: system.switches
    }

    for (const l in system.members) {
        const member = system.members[l]
        let memid = member.id
        const oldid = memid
        if (!validIdRegex.test(memid)) {
            memid = generateRandomId()
        }
        //@ts-ignore aaaaaaaaaaaaaaaaaaaaaaaaaa
        while (obj.members[memid] != null) {
            memid = generateRandomId()
        }
        for (const sw of obj.switches)
            for (let i = 0; i < sw.members.length; i++)
                if (sw.members[i] == oldid) sw.members[i] = memid
        //@ts-ignore technically doesn't exist in type
        obj.members[memid] = {
            id: memid,
            name: typeof member.name != "string" || member.name == "" ? memid : member.name,
            displayName: typeof member.dispaly_name != "string" || member.dispaly_name == "" ? null : member.displayName,
            description: typeof member.description != "string" || member.description == "" ? null : member.description,
            birthday: typeof member.birthday != "string" || member.birthday == "" ? null : member.birthday,
            pronouns: typeof member.pronouns != "string" || member.pronouns == "" ? null : member.pronouns,
            color: typeof member.color != "string" || member.color == "" ? null : member.color,
            avatarUrl: typeof member.avatar_url != "string" || member.avatar_url == "" ? null : member.avatar_url,
            keepProxy: member.keep_proxy,
            messageCount: member.message_count,
            timestamp: typeof member.created != "string" || member.created == "" ? null : member.timestamp,
            serverDisplayName: member.server_nick,
            serverAvatarUrl: member.server_avatar,
            serverProxy: member.server_proxy
        }
        for (const m in member.proxy_tags) {
            const proxy = member.proxy_tags[m]
            obj.proxyTags.push(<never>proxy)
        }
    }
    const newSwitches = []
    for (let i = 0; i < obj.switches.length; i++) {
        if (!obj.switches[i].timestamp || typeof obj.switches[i].timestamp != "string") continue
        else if (!obj.switches[i] || typeof obj.switches != "object") continue
        newSwitches.push(obj.switches[i])
    }
    obj.switches = newSwitches
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
