import React, { useState, useEffect } from 'react';
import {
  useHistory, 
  useLocation,
 } from 'react-router';
import { Customer, GuaranteedLoans } from '../../../Shared/Services/interfaces';
import { getCustomerByID } from '../../Services/APIs/Customer-Creation/getCustomer';
import { getErrorMessage } from '../../../Shared/Services/utils';
import { Tab } from '../HeaderWithCards/cardNavbar'
import * as local from '../../../Shared/Assets/ar.json';
import { getIscoreCached } from '../../Services/APIs/iScore/iScore';
import { guaranteed } from "../../Services/APIs/Reports";
import ClientGuaranteedLoans from "../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans";
import ability from '../../config/ability';
import { getGeoAreasByBranch } from '../../Services/APIs/GeoAreas/getGeoAreas';
import Swal from 'sweetalert2';
import { CustomerScore, getCustomerCategorization } from '../../Services/APIs/Customer-Creation/customerCategorization';
import { Profile ,InfoBox, ProfileActions} from "../../../Shared/Components";
import { TabDataProps } from '../../../Shared/Components/Profile/types';
import { CustomerReportsTab } from './customerReportsTab';
import HalanLinkageModal from "./halanLinkageModal";
import { blockCustomer } from "../../Services/APIs/blockCustomer/blockCustomer";
import { Container } from 'react-bootstrap';
import { getCustomerInfo } from '../../../Shared/Services/formatCustomersInfo';

interface Props {
  history: Array<string | { id: string }>;
  location: {
    state: {
      id: string;
    };
  };
};
export interface Score {
  customerName?: string;
  activeLoans?: string;
  iscore: string;
  nationalId: string;
  url?: string;
  bankCodes?: string[];
}
const tabs: Array<Tab> = [
  {
    header: local.workInfo,
    stringKey: 'workInfo'
  },
  {
    header: local.differentInfo,
    stringKey: 'differentInfo'
  },
  {
    header: local.customerCategorization,
    stringKey: 'customerScore'
  },
  {
    header: local.documents,
    stringKey: 'documents'
  },
]

const getCustomerCategorizationRating = async (id: string, setRating: (rating: Array<CustomerScore>) => void) => {
  const res = await getCustomerCategorization({ customerId: id })
  if (res.status === "success" && res.body?.customerScores !== undefined) {
    setRating(res.body?.customerScores)
  } else {
    setRating([])
  }
}

export const CustomerProfile = (props: Props) => {
  const [loading, changeLoading] = useState(false);
  const [customerDetails, changeCustomerDetails] = useState<Customer>();
  const [iScoreDetails, changeiScoreDetails] = useState<Score>();
  const [activeTab, changeActiveTab] = useState('workInfo');
  const [ratings, setRatings] = useState<Array<CustomerScore>>([]);
  const [showHalanLinkageModal, setShowHalanLinkageModal] = useState<boolean>(false)
  const location = useLocation();
  const history = useHistory();

  async function getCachediScores(id) {
    changeLoading(true);
    const iScores = await getIscoreCached({ nationalIds: [id] });
    if (iScores.status === "success") {
      changeiScoreDetails(iScores.body.data[0])
      changeLoading(false);
    } else {
      changeLoading(false);
      Swal.fire('Error !', getErrorMessage(iScores.error.error),'error');
    }
  }
  const [print, _changePrint] = useState<any>();
  const [dataToBePrinted, changeDataToBePrinted] = useState<any>();
  const [guaranteeedLoansData, changeGuaranteeedLoansData] = useState<GuaranteedLoans>()
  const [geoArea, setgeoArea] = useState<any>();
  const getGuaranteeedLoans = async (customer) => {
    changeLoading(true);
    const res = await guaranteed(customer?.key)
    if (res.status === 'success') {
      await changeGuaranteeedLoansData(res.body);
      changeLoading(false);
    } else {
      changeLoading(false);
      Swal.fire('Error !', getErrorMessage(res.error.error),'error');
    }
  }
  const getGeoArea = async (geoArea, branch) => {
    changeLoading(true);
    const resGeo = await getGeoAreasByBranch(branch);
    if (resGeo.status === "success") {
      changeLoading(false);
      const geoAreaObject = resGeo.body.data.filter(area => area._id === geoArea);
      if (geoAreaObject.length === 1) {
        setgeoArea(geoAreaObject[0])
      }else setgeoArea({name: '-', active: false})
    } else {
       changeLoading(false);
       Swal.fire('Error !', getErrorMessage(resGeo.error.error),'error');
    }
  }
  async function getCustomerDetails() {
    changeLoading(true);
    const res = await getCustomerByID(location.state.id)
    if (res.status === 'success') {
      await changeCustomerDetails(res.body);
      if (ability.can('viewIscore', 'customer')) await getCachediScores(res.body.nationalId);
      await getGuaranteeedLoans(res.body);
      await getGeoArea(res.body.geoAreaId, res.body.branchId);
    } else {
      changeLoading(false);
      Swal.fire('Error !', getErrorMessage(res.error.error),'error');
    }
  }

  useEffect(() => {
    getCustomerDetails();
     if(ability.can('deathCertificate','customer')) {
       if(tabs.some(tab => tab.stringKey ==='deathCertificate')){}
       else{
       tabs.push({
        header: local.deathCertificate,
        stringKey:'deathCertificate',    
      })
    }
    }
      if (ability.can('guaranteed', 'report')) {
        if(tabs.some(tab => tab.stringKey ==='reports')){}
        else{
        tabs.push({
          header: local.reports,
          stringKey: 'reports'
        })
      }
    }
    getCustomerCategorizationRating(location.state.id, setRatings);
  }, []);
  function getArGender(gender: string | undefined) {
    if (gender === 'male') return local.male;
    else return local.female;
  }
  function getArRuralUrban(ruralUrban: string | undefined) {
    if (ruralUrban === 'rural') return local.rural;
    else return local.urban;
  }
  const handleActivationClick = async ({ id, blocked }) => {
    const { value: text } = await Swal.fire({
      title:
        blocked?.isBlocked === true ? local.unblockReason : local.blockReason,
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:
        blocked?.isBlocked === true
          ? local.unblockCustomer
          : local.blockCustomer,
      cancelButtonText: local.cancel,
      inputValidator: (value) => {
        if (!value) {
          return local.required;
        } else return "";
      },
    });
    if (text) {
      Swal.fire({
        title: local.areYouSure,
        text:
          blocked?.isBlocked === true
            ? local.customerWillBeUnblocked
            : local.customerWillBeBlocked,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText:
          blocked?.isBlocked === true
            ? local.unblockCustomer
            : local.blockCustomer,
        cancelButtonText: local.cancel,
      }).then(async (result) => {
        if (result.value) {
          changeLoading(true)
          const res = await blockCustomer(id, {
            toBeBlocked: blocked?.isBlocked === true ? false : true,
            reason: text,
          });
          if (res.status === "success") {
            changeLoading(false)
            Swal.fire(
              "",
              blocked?.isBlocked === true
                ? local.customerUnblockedSuccessfully
                : local.customerBlockedSuccessfully,
              "success"
            ).then(() => window.location.reload());
          } else {
            changeLoading(false)
            Swal.fire("", local.searchError, "error");
          }
        }
      });
    }
  };
  const mainInfo = customerDetails && [getCustomerInfo({customerDetails,score:iScoreDetails, isLeader: false })]

  const tabsData: TabDataProps = {
    workInfo: [
      {
        fieldTitle: local.businessName,
        fieldData: customerDetails?.businessName || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessAddress,
        fieldData: customerDetails?.businessAddress || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.customerCode,
        fieldData: customerDetails?.code || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.governorate,
        fieldData: customerDetails?.governorate || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.district,
        fieldData: customerDetails?.district || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.village,
        fieldData: customerDetails?.village || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.ruralUrban,
        fieldData: getArRuralUrban(customerDetails?.ruralUrban) || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessPhoneNumber,
        fieldData: customerDetails?.businessPhoneNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessPostalCode,
        fieldData: customerDetails?.businessPostalCode || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessSector,
        fieldData: customerDetails?.businessSector || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessActivity,
        fieldData: customerDetails?.businessActivity || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessSpeciality,
        fieldData: customerDetails?.businessSpeciality || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseNumber,
        fieldData: customerDetails?.businessLicenseNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssuePlace,
        fieldData: customerDetails?.businessLicenseIssuePlace || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssueDate,
        fieldData: customerDetails?.businessLicenseIssueDate || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.commercialRegisterNumber,
        fieldData: customerDetails?.commercialRegisterNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.industryRegisterNumber,
        fieldData: customerDetails?.industryRegisterNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.taxCardNumber,
        fieldData: customerDetails?.taxCardNumber || "",
        showFieldCondition: true,
      },
    ],
    differentInfo: [
      {
        fieldTitle: local.geographicalDistribution,
        fieldData: geoArea?.name,
        fieldDataStyle: {
          color: !geoArea?.active && geoArea?.name !== "-" ? "red" : "black",
        },
        showFieldCondition: true,
      },
      {
        fieldTitle: local.representative,
        fieldData: customerDetails?.representativeName || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.applicationDate,
        fieldData: customerDetails?.applicationDate || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.permanentEmployeeCount,
        fieldData: customerDetails?.permanentEmployeeCount || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.partTimeEmployeeCount,
        fieldData: customerDetails?.partTimeEmployeeCount || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.maxLoansAllowed,
        fieldData: customerDetails?.maxLoansAllowed
          ? customerDetails.maxLoansAllowed
          : "-",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.allowGuarantorLoan,
        fieldData: customerDetails?.allowGuarantorLoan ? (
          <span className="fa fa-check"></span>
        ) : (
          <span className="fa fa-times"></span>
        ),
        showFieldCondition: true,
      },
      {
        fieldTitle: local.guarantorMaxLoans,
        fieldData: customerDetails?.guarantorMaxLoans
          ? customerDetails.guarantorMaxLoans
          : "-",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.maxCustomerPrincipal,
        fieldData: customerDetails?.maxPrincipal
          ? customerDetails.maxPrincipal
          : "-",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.comments,
        fieldData: customerDetails?.comments || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.blockReason,
        fieldData: customerDetails?.blocked?.reason || "",
        showFieldCondition: Boolean(
          customerDetails?.blocked && customerDetails?.blocked?.isBlocked
        ),
      },
      {
        fieldTitle: local.unblockReason,
        fieldData: customerDetails?.blocked?.reason || "",
        showFieldCondition: Boolean(
          customerDetails?.blocked &&
            !customerDetails?.blocked?.isBlocked &&
            customerDetails?.blocked?.reason
        ),
      },
      {
        fieldTitle: local.businessLicenseNumber,
        fieldData: customerDetails?.businessLicenseNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssuePlace,
        fieldData: customerDetails?.businessLicenseIssuePlace || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.businessLicenseIssueDate,
        fieldData: customerDetails?.businessLicenseIssueDate || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.commercialRegisterNumber,
        fieldData: customerDetails?.commercialRegisterNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.industryRegisterNumber,
        fieldData: customerDetails?.industryRegisterNumber || "",
        showFieldCondition: true,
      },
      {
        fieldTitle: local.taxCardNumber,
        fieldData: customerDetails?.taxCardNumber || "",
        showFieldCondition: true,
      },
    ],
    customerScore: [
      {
        fieldTitle: "ratings",
        fieldData: ratings,
        showFieldCondition: Boolean(
          customerDetails?.hasLoan &&
            ability.can("customerCategorization", "customer")
        ),
      },
    ],
    documents: [
      {
        fieldTitle: "customer id",
        fieldData: location.state.id,
        showFieldCondition: true,
      },
    ],
    reports: [
      {
        fieldTitle: "reports",
        fieldData: (
          <CustomerReportsTab
            changePrint={async (pdf) => {
              await changeDataToBePrinted(pdf.data);
              await _changePrint(pdf.key);
              window.print();
            }}
            PDFsArray={[
              {
                key: "ClientGuaranteedLoans",
                local: local.ClientGuaranteedLoans,
                //   inputs: ["dateFromTo", "branches"],
                data: guaranteeedLoansData,
                permission: "guaranteed",
              },
            ]}
          />
        ),
        showFieldCondition: ability.can('guaranteed', 'report'),
      },
    ],
    deathCertificate: [
      {
        fieldTitle: "deathCertificate",
        fieldData: location.state.id,
        showFieldCondition: ability.can("deathCertificate", "customer"),
      },
    ],
  };
  const getProfileActions = () => {
    return [
      {
        icon: "editIcon",
        title: local.edit,
        permission:
          ability.can("updateCustomer", "customer") ||
          ability.can("updateNationalId", "customer"),
        onActionClick: () =>
          history.push("/customers/edit-customer", {
            id: location.state.id,
          }),
      },
      {
        title: local.createClearance,
        permission: ability.can("newClearance", "application"),
        onActionClick: () =>
          history.push("/customers/create-clearance", {
            customerId: location.state.id,
          }),
      },
      {
        icon: "deactivate-user",
        title: customerDetails?.blocked?.isBlocked
          ? local.unblockCustomer
          : local.blockCustomer,
        permission: ability.can('blockAndUnblockCustomer', 'customer'),
        onActionClick: () =>
          handleActivationClick({
            id: location.state.id,
            blocked: customerDetails?.blocked,
          }),
      },
      {
        title: local.halanLinkage,
        permission: true,
        onActionClick: () => setShowHalanLinkageModal(true),
      },
    ];
  };
  return (
    <>
      <Container className="print-none">
        <div style={{ margin: 15 }}>
          <div className="d-flex flex-row justify-content-between" >
            <h3> {local.viewCustomer}</h3>
            <ProfileActions actions={getProfileActions()} />
          </div>
        {mainInfo && <InfoBox info={mainInfo} />}
        </div>
        <Profile
          source='individual'
          loading={loading}
          // backButtonText={local.viewCustomer}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(stringKey) => changeActiveTab(stringKey)}
          tabsData={tabsData}
        />
        {showHalanLinkageModal && (
          <HalanLinkageModal
            show={showHalanLinkageModal}
            hideModal={() => setShowHalanLinkageModal(false)}
            customer={customerDetails}
          />
        )}
      </Container>
      {print === "ClientGuaranteedLoans" && dataToBePrinted && (
        <ClientGuaranteedLoans data={dataToBePrinted} />
      )}
    </>
  );
}