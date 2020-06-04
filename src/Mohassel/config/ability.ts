import { Ability, AbilityBuilder } from "@casl/ability";
import store from '../redux/store';

// Defines how to detect object's type
function subjectName(item) {
    if (!item || typeof item === "string") {
        return item
    }
    return item.__type
}
const ability = new Ability([], { subjectName });
store.subscribe(() => {
    if (store.getState().auth.loading === false) {
        const clientPermissions = store.getState().auth.clientPermissions
        ability.update(defineRulesFor(clientPermissions));
    }
});
function defineRulesFor(clientPermissions) {
    const { can, rules } = new AbilityBuilder<Ability>(Ability);
    Object.keys(clientPermissions).forEach(key => {
        const name = key.split('/')[1]
        clientPermissions[key].forEach(action => {
            can(action,name)
        })
    })
    return rules
}

export default ability;