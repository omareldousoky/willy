import React, { useEffect, useState } from 'react';
import local from '../../../Shared/Assets/ar.json';
import { getCustomerCategorization } from '../../Services/APIs/Customer-Creation/customerCategorization';

type Props = {
  id: string;
}

const getCustomerCategorizationRating = async (id: string, setRating: (rating: number) => void) => {
  const res = await getCustomerCategorization({ customerId: id })
  if (res.status === "success" && res.body?.customerScore !== undefined) {
    setRating(res.body?.customerScore)
  } else {
    console.log(res.error)
  }
}

export const CustomerCategorization = (props: Props) => {
  const [rating, setRating] = useState(0);
  const [color, setColor] = useState("");
  const { id } = props;

  useEffect(() => {
    getCustomerCategorizationRating(id, setRating)
  }, [])

  useEffect(()=> {
    if(rating >= 4 && rating <= 6) setColor("#7DC356")
    if(rating >= 7 && rating <=9) setColor("#edb600")
    if(rating >= 10 && rating <= 12) setColor("#ff0000")
  }, [rating])
  
  return (
    <div style={{background: color, padding: 10, color:"#fff", borderRadius: 20}}>
      {local.customerCategorization + " : " + rating}
    </div>
  )
}