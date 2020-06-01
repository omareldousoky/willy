import { Ability, AbilityBuilder } from "@casl/ability";
import { getCookie } from '../Services/getCookie';

// Defines how to detect object's type
function subjectName(item) {
    if (!item || typeof item === "string") {
        return item
    }
    return item.__type
}
const ability = new Ability([], { subjectName });
const roles = JSON.parse(getCookie('roles'))

function defineRulesFor(auth) {
    const { can, rules } = new AbilityBuilder<Ability>(Ability);
    const perms = JSON.parse(getCookie('clientpermissions'));
    Object.keys(perms).forEach(key => {
        const name = key.split('/')[1]
        perms[key].forEach(action => {
            can(action,name)
        })
    })
    return rules
}
ability.update(defineRulesFor(roles));

export default ability;