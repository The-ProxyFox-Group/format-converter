const systems = JSON.parse(Deno.readTextFileSync("./systems.json"))
const roles = JSON.parse(Deno.readTextFileSync("./roles.json"))

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

for (const j in systems) {
    const system = systems[j]
    const id = system.id;
    const obj = {
        id,
        accounts: [j],
        name: system.name,
        description: system.description,
        tag: system.tag,
        avatarUrl: system.avatar_url,
        timestamp: system.created,
        autoType: system.auto_bool? "latch": undefined,
        members: {},
        serverProxy: system.server_proxy,
        proxyTags: [],
        switches: system.switches
    }

    for (const l in system.members) {
        const member = system.members[l]
        const memid = member.id
        //@ts-ignore technically doesn't exist in type
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
