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
    if (auth.includes("DataEntry")) {
        can("view", "Customer")
        can("edit", "Customer")
        can("view", "Application")
        can("edit", "Application")
        can("reject", "Application")
    }
    if (auth.includes("Auditor")) {
        can("accept", "Application")
        can("review", "Application")
        can("view", "Application")
        can("unReview", "Application")
    }
    if (auth.includes("SysAdmin")) {
        can("edit", "NationalId")
        can("view", "Application")
    }
    return rules
}
ability.update(defineRulesFor(roles));

export default ability;