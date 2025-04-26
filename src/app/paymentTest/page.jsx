'use client'

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser'
import { useSearchParams } from 'next/navigation'
import NavPayment from '../components/NavPayment';

import provinces from '../../../data/provinces.json';
import amphures from '../../../data/amphures.json';
import districts from '../../../data/districts.json';

const API_URL = 'http://localhost:3111/api/v1';

function PaymentPage() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('auctionId');

  const [auction, setAuction] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [paymentId, setPaymentId] = useState('');
  const [note, setNote] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // const shippingFee = 54;
  // const total = (auction?.currentPrice || 0) + shippingFee;
  // const searchParams = useSearchParams()
  // const [selectedSlip, setSelectedSlip] = useState(null)

  // const [showForm, setShowForm] = useState(false);
  // const [previewUrl, setPreviewUrl] = useState(null)
  // const [paymentMethod, setPaymentMethod] = useState('qr')
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  // const [cardDetails, setCardDetails] = useState({
  //   number: '',
  //   name: '',
  //   expiry: '',
  //   cvv: ''
  // })

  // const name = searchParams.get('name')
  // const price = searchParams.get('price')
  const quantity = searchParams.get('quantity') || 1
  // const auctionId = searchParams.get('auctionId');

  // const [auction, setAuction] = useState(null);
  // const [qrCode, setQrCode] = useState(null);
  // const [paymentId, setPaymentId] = useState('');
  // const [note, setNote] = useState('');
  // const [slipFile, setSlipFile] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [qrError, setQrError] = useState('');

  // const [recipientName, setRecipientName] = useState('');
  // const [recipientPhone, setRecipientPhone] = useState('');
  // const [shippingAddress, setShippingAddress] = useState('');

  // const shippingFee = 54;
  // const total = (auction?.currentPrice || 0) + shippingFee;
    // const [profile, setProfile] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [refresh, setRefresh] = useState(false);
    // const [editId, setEditId] = useState(null);
  
    // const [newLabel, setNewLabel] = useState('');
    // const [newName, setNewName] = useState('');
    // const [newPhone, setNewPhone] = useState('');
    // const [newAddress, setNewAddress] = useState('');
  
    // const [selectedProvince, setSelectedProvince] = useState('');
    // const [selectedAmphure, setSelectedAmphure] = useState('');
    // const [selectedDistrict, setSelectedDistrict] = useState('');
    // const [zipcode, setZipcode] = useState('');

 useEffect(() => {
    const loadAll = async () => {
      if (!auctionId) return;

      const [auctionRes, qrRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/auction/${auctionId}`),
        fetch(`${API_URL}/payment/generate-qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ auctionId }),
        }),
        fetch(`${API_URL}/profile`, { credentials: 'include' }),
      ]);

      const auctionData = await auctionRes.json();
      if (auctionData.status === 'success') setAuction(auctionData.data);

      const qrData = await qrRes.json();
      if (qrData.success) {
        setQrCode(qrData.qrCode);
        setPaymentId(qrData.paymentId);
        setQrError('');
      } else {
        setQrError(qrData.error || 'ไม่สามารถสร้าง QR ได้');
      }

      const profileData = await profileRes.json();
      if (profileData.status === 'success') {
        const user = profileData.data;
        setRecipientName(user.name || '');
        setRecipientPhone(user.phone || '');

        const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
        if (defaultAddress) {
          setShippingAddress(defaultAddress.fullAddress);
        }
      }

      setLoading(false);
    };

    loadAll();
  }, [auctionId]);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSlipFile(file);
  };

  const handlePlaceOrder = async () => {
    if (!slipFile) return alert('กรุณาอัปโหลดสลิป');
    if (!shippingAddress) return alert('ไม่พบที่อยู่จัดส่ง');

    const formData = new FormData();
    formData.append('slip', slipFile);

    const uploadRes = await fetch(`${API_URL}/payment/upload-slip/${paymentId}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) return alert('❌ อัปโหลดสลิปล้มเหลว');

    const addressRes = await fetch(`${API_URL}/payment/shipping-address/${paymentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        address: shippingAddress,
        note,
      }),
    });

    const addressData = await addressRes.json();
    if (!addressData.success) return alert('❌ บันทึกที่อยู่ล้มเหลว');

    alert('✅ ส่งข้อมูลคำสั่งซื้อสำเร็จ กรุณารอการอนุมัติ');
  };

  if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;

  //   const fetchProfile = async () => {
  //       try {
  //         const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
  //         const data = await res.json();
  //         setProfile(data.data);
  //       } catch (err) {
  //         // setError('ไม่สามารถโหลดโปรไฟล์ได้');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };


  // useEffect(() => {
  //   fetchProfile();
  // }, [refresh]);

  // useEffect(() => {
  //   const district = districts.find(d => d.id === Number(selectedDistrict));
  //   if (district) setZipcode(district.zip_code.toString());
  // }, [selectedDistrict]);

  // const amphureOptions = amphures.filter(a => a.province_id === Number(selectedProvince));
  // const districtOptions = districts.filter(d => d.amphure_id === Number(selectedAmphure));

  // if (loading) return <div className="text-center py-6 text-gray-500">⏳ กำลังโหลดข้อมูล...</div>;
  // if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  // const handleSlipUpload = (event) => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     setSelectedSlip(file)
  //     // Create preview URL for the image
  //     const url = URL.createObjectURL(file)
  //     setPreviewUrl(url)
  //   }
  // }

  // const handleSubmitPayment = async () => {
  //   if (!selectedSlip) {
  //     alert('กรุณาแนบสลิปการโอนเงิน')
  //     return
  //   }
  //   // Add your payment submission logic here
  // }


  return (
    <div >
      <NavPayment />
      <div className="container mx-auto px-4 py-8 ">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1> */}
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Product Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-semibold">สินค้า</p>
                <img src={auction?.image?.[0]} className="w-20 h-20 object-cover rounded border" />
                <p className="font-semibold">{auction?.name}</p>
              </div>
              
              <div className="border-b pb-4">
                <p className="font-semibold">จำนวน</p>
                <p className="font-semibold">{quantity} ชิ้น</p>
              </div>

              <div className="border-b pb-4">
                <p className="font-semibold">ราคารวม</p>
                <p className="font-semibold text-xl text-blue-600">
                  {auction?.currentPrice} บาท
                </p>
              </div>
              
              <div className="mt-4 text-sm">
              <label className="block font-medium mb-1">หมายเหตุ</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                // placeholder="ฝากข้อความถึงผู้ขาย เช่น กรุณาห่อกันกระแทก"
              />
            </div>

              {/* Add Shipping Address Section */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">ที่อยู่จัดส่ง</h3>
                <p>ชื่อผู้รับ: {recipientName || '—'}</p>
                <p>เบอร์โทร: {recipientPhone || '—'}</p>
                <p>ที่อยู่: {shippingAddress || '—'}</p>
                {/* <div>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="ระบุที่อยู่จัดส่ง เช่น บ้านเลขที่ ถนน ตำบล/แขวง อำเภอ/เขต จังหวัด รหัสไปรษณีย์"
                    required
                  ></textarea>
                </div> */}
              </div>
           
            </div>
          </div>

          {/* Right Side - Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
              <p className="text-2xl font-bold text-blue-600">
              {auction?.currentPrice} บาท
              </p>
            </div>

            <div className="mt-4 text-center">
              {qrCode ? (
                <>
                  <img src={qrCode} alt="QR Promptpay" className="w-44 h-44 border mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">📷 กรุณาสแกนเพื่อชำระเงิน</p>
                </>
              ) : qrError ? (
                <p className="text-red-600 text-sm mt-2">❌ {qrError}</p>
              ) : (
                <p className="text-gray-500 text-sm">⏳ กำลังสร้าง QR Code...</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">แนบสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlipUpload}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
            

            {/* <div className="flex justify-end items-center mt-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">ราคาสินค้า: ฿{auction?.currentPrice}</p>
              <p className="text-sm text-gray-500">ค่าจัดส่ง: ฿{shippingFee}</p>
              <p className="text-xl font-bold text-red-600 mt-2">ยอดชำระทั้งหมด: ฿{total}</p>
            </div>
          </div> */}
          <div className="flex justify-end mt-6">
            <button 
              onClick={handlePlaceOrder}
              disabled={!paymentId}
              className="bg-green-500 text-white text-lg px-3 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    
              >
              ยืนยันการชำระเงิน
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage