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
store.subscribe(() => {
    if (store.getState().auth.loading === false) {
        const clientPermissions = store.getState().auth.clientPermissions
        ability.update(defineRulesFor(clientPermissions));
    }
});

export default ability;