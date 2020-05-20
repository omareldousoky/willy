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
    console.log(perms, Object.keys(perms))
    Object.keys(perms).forEach(key => {
        const name = key.split('/')[1]
        console.log(name)
        perms[key].forEach(action => {
            can(action,name)
        })
    })
    // if (auth.includes("Data-Entry")) {
    //     can("create", "Customer")
    //     can("edit", "Customer")
    //     can("view", "Customer")
    //     can("view", "Application")
    //     can("edit", "Application")
    //     can("create", "Application")
    //     can('create','Loan')
    // }
    // if (auth.includes("Auditor")) {
    //     can("view", "Application")
    //     can("review", "Application")
    //     can("reject", "Application")
    //     can("unReview", "Application")
    //     can('issue','Loan')
    // }
    // if (auth.includes("Sys-admin")) {
    //     can("view", "Application")
    //     can('filterByBranch','Application')
    //     can("create", "CalculationMethod")
    //     can("test", "CalculationMethod")
    //     can("create", "LoanProduct")
    //     can("assignToBranch", "LoanProduct")
    //     can("create", "LoanUsage")
    //     can("edit", "LoanUsage")
    // }
    // if (auth.includes("IT-ops")) {
    //     can("edit", "Customer")
    //     can("view", "Customer")
    //     can("create","User")
    //     can("edit","User")
    //     can("edit", "NationalId")
    //     can("view", "Application")
    //     can("bulkApprove", "Application")
    //     can('filterByBranch','Application')
    //     can('create','Branch')
    // }
    console.log(rules)
    return rules
}
//for all roles:
// ability.update(defineRulesFor(["Data-Entry","Auditor","Sys-admin","IT-ops"]));
ability.update(defineRulesFor(roles));

export default ability;