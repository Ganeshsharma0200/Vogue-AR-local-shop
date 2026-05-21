// Shared image base
const IMG = 'https://lh3.googleusercontent.com/aida-public/';
const I = {
  ethnic1: IMG+'AB6AXuDQHk2O0PgKc5Nd4TXo5OrNlnPX2ZCLh2H7yWcLpkRC_iIQ9OFIhT50Xyk0abX4buDahUSPJ14NZtDkR1g-iF744qZe4Sn8zxR9esyOMW1l23zuHMhsgNEj1X1BUhTUxjarN8xShHJj70SZzpaKVNoGgHuxdFbzedQAq5cZoogtad1vxqFZMvaoEZLXBXeidWMVKaJlZ-JRaP27FYV339VwDfpucKUu9NKfMhhOU8jn7GL3szlvnkfs9aYOn-YCVU9WKlXpXJBqTzt8',
  ethnic2: IMG+'AB6AXuCJdem_iB4_W2j0y7rilzs-DCtH2Wml2byNhsbw_o032Syq9gg2bUkRYPpfz4bO_6jhXWnePkR9Md7Z8Gthkq0Rb5RR6jDWqSRtrPppTMRY75ZgleVklhVPI6zEpDh4aPIawoC3UGAoV9YaPoqBKN165KjVytuwS0EUIgTXYu00v2z--CyjaQDGwlZGFabTT7XHXrBPikLahmbSpeR7HHOYTdj22cjxY3ZnI6VJydEqGMxJr7KiFJdPQWAej1iwc8Vf5o8lImfenHr2',
  ethnic3: IMG+'AB6AXuBZP5rc_3IcFncER-qbFhbuYqFj7HBHPdyvLnLelfhRclZ6cM5aZUbwhNwsACZnN-xj-BnZd-LG8phY5l0b9tjUCBRMA_BnDbV8_cjJqMiKVGyZ4rgtA_icsAJ9UWx51O4GxlvFLoER9wKLInhGOmWsFGPGSao0iL21JniDVLTDQzKz8RMxLbYB0GK245qNdopGSAmMi4AhtMqw_IyhCR-ig-6DJNrPw90vuS3MtIUWtlmtAQGY7iKbJQj92882PA4nX9yB64_ueeIf',
  store1: IMG+'AB6AXuClCpYNabDamFmVt2fg70qfq_ay47jbsKLKLeikXQkfT_cdZNy0IeIB7hzvxZy5vy_nF9lB9wVVeoBmI6LytZfnHFA6uv8Q7HOLSpa4LTqNgRaMktjxbqmU5U1GiPwBHuDM7xgji2En-Cgj7FaQ5XgKCM9DUvAaj0siUltuJJ6LEmsIkVBCusTi1qWwd9nF-xiMXYkp8GJ13v0EjkH2A7Kvi3WvhJOzhLFYkLA6eCHOQ2Q35qpL55EUxA0JCAhCH0bHKsAgKmgzVNoE',
  mens1: IMG+'AB6AXuCtKxh3pZi0I6KpuEXDR-5IltTppGP8xoCOjPQIFQG_C69SctR4PiVKfcOhyWYV6AyYTzcjb0mdYg9o9orjQgv8N3Gu4zneC4dv1TvwCXRadFgdXlXcX5CnEzikzcrlP-UrplqWF6Y017B2odkGP6rfyfZ-iF7E27OenSHt_C5a294QNvKEQJTLYnt_uUxSHNDGmDcW4me_gjEqByM5sPn9Yh3U2NjeYKfv3wJgP0NAPDCWbzQ-vmjrctXKco4VIxls-HIcm7DTTcFS',
  mens2: IMG+'AB6AXuBJ0AKUnFMqPAfoCBWrpl1lYRjMM8ZwlFFFSlyOesciLp7NFPXTl2T8EIP4mvmhbRTpVMoS7BVEV1JtDjf35Od8GG5ywz-NeqaUQSum25umhIPtMayZ6p_GKm9ApdXSQguLqNfaKTPiiFm3fmsYCX2suqdT4-PnEH_Gfzk5U46bloe3_Eoi6984V_WjEcuDM8K52yBnz4zKUAdCNB32KrcL0E4QGFGGaWKBErXJusa50-muIjZ_Izh25o0xEEeJMN2LJeG09RfkhLiz',
  mens3: IMG+'AB6AXuDysfE_Sys-VQBQVbxtUIK3NJPKlfhYM_gS3r5zmRugXgbVNg2eq28ZZkGZS4uuz4Zq-B7o6s2OPv6gf9b1QNhVU88DNsHo2h-LaugtX5gIWzyHc4XwOMCaeXaEBYvqmdjXs-8jFfH3gBWM0s_jJx4nZwLr3ExU5JX6fsl-vOAB7UUCgffFzDjB6X8whBlU9u9t0cM3LAAvbsF-6ev_StuZLsm1HrJFRC7vHUB1kKJ76yXgFONG8ueTRU2AFZsMU0Z1UALnP5GFViX7',
  urban1: IMG+'AB6AXuBbP164_15OFp2ogNQfd0Awq3Gb15KkKBAoWdAlATU-z__rJYl4xXpuowT6XJJK-VQrEOqH_XNOnzig6AI7Hl6XffHubZ-7IWcPahkZgmqPLXtRxLqD4Qf63M1M9yZqBB4rikL69QI3LP3L9Oh-utczluZL3WUex__zIQua2jdACUZllDJF4HwABMytisrKG18A7nmvktIbNX4HttFEdw8OikAsglSBJCOGNCnq1_BIqISZ_odkupFwCaQ7h6ib8Kib88WP1RLEVaa1',
  urban2: IMG+'AB6AXuBRZayOkbbKJwhAw4PrRFe7YeCP2ZJ-TVdU6mFtZD4d8oFOx13JicOcNyM-Pck1UKj1GZehHxcjL_xOFfghemUiEsoNPGqPWgm10wpK1eted46q5_qJbbkkWJGi-MhVyT7aoWuRjE6M_J9cp1WuMTKChvd5w57uwZCpe2Qsw3cVdzETmteOdUdIn-pwV4fIlY9L-0rQsdWp1WdES6MyMaTZf5mAwsTgqtRpRiMS-lWyy671nhfoWAtcc082iXKQwks3GkVQ5zzO6MB4',
  urban3: IMG+'AB6AXuDIAmAnZ-RfRt31EOoxxIzgY5Ljq0vbhEDiW1NeTr8OBRJcJZQu2QQ7T_gekOCOXfU2v5DMFEjfH3wggVZUYlOFbMmOTejhFkB-rTOemMhfdWbIWkbFA3DcSI_U7cX-eQ4I_uFjmnVppdVPm9vUDaNJbcYMUybSjAZ82DeBdv1ihXwt8MH4c_7LWYHItPhYA2QTS4CfZaCFTgy5_mzPH-AHnxU9fstROOxj_KDlPFYnvb7swR_ujmzMuxc3y4IFq_QV8HJiiUSORcHl',
  avatar: IMG+'AB6AXuBAV07vMDYavYHUnztXX9lsbl2Z5xYBnphsgrsQfszynkEyxD9fwUfgtyGScrDUNUthSOo81Ug7K8KW88AKaE3vmMqRsRMYaQnJOk8IAyp2s4m91yS6VwoFW-IizWDaOy6-K-H4LeXXMm1wsQqknGk7EgwfFTXoQ3KC7c5JZl0409LhQVcrRA_BVw9cK7jBpUJjXtMHGRt59l6zF_AnUVuvzNwER9skyTXCddctN7KmMbmAdIl7q9KBOa97AiMKxooKK9-nve9_xRi6',
};
export { I as IMAGES };

export const shops = [
  {
    id:'shop-1', name:'Vogue Ethnic', ownerName:'Priya Sharma', phone:'+91 98765 43210',
    address:'142 Fashion Avenue, Cyber City', distance:'1.2 km', distanceNum:1.2,
    rating:4.8, reviewCount:124, arAvailable:true, verified:true,
    openTime:'10:00 AM', closeTime:'9:00 PM', isOpen:true,
    categories:['women','ethnic'], productCount:14,
    location:{lat:28.4595,lng:77.0266},
    images:{storefront:I.store1, featured:I.ethnic1, thumb1:I.ethnic2, thumb2:I.ethnic3}
  },
  {
    id:'shop-2', name:"Classic Men's Wear", ownerName:'Rajesh Kumar', phone:'+91 87654 32109',
    address:'78 Tailor Street, MG Road', distance:'2.5 km', distanceNum:2.5,
    rating:4.5, reviewCount:89, arAvailable:true, verified:true,
    openTime:'10:00 AM', closeTime:'8:30 PM', isOpen:true,
    categories:['men','western'], productCount:8,
    location:{lat:28.4650,lng:77.0310},
    images:{storefront:I.mens1, featured:I.mens1, thumb1:I.mens2, thumb2:I.mens3}
  },
  {
    id:'shop-3', name:'Urban Threads', ownerName:'Anil Verma', phone:'+91 76543 21098',
    address:'23 Street Fashion Lane, Sector 15', distance:'3.1 km', distanceNum:3.1,
    rating:4.2, reviewCount:56, arAvailable:false, verified:true,
    openTime:'11:00 AM', closeTime:'9:00 PM', isOpen:true,
    categories:['men','western'], productCount:24,
    location:{lat:28.4700,lng:77.0200},
    images:{storefront:I.urban1, featured:I.urban1, thumb1:I.urban2, thumb2:I.urban3}
  },
  {
    id:'shop-4', name:'Silk Heritage', ownerName:'Meena Devi', phone:'+91 65432 10987',
    address:'56 Silk Market, Old City', distance:'4.0 km', distanceNum:4.0,
    rating:4.9, reviewCount:210, arAvailable:true, verified:true,
    openTime:'9:00 AM', closeTime:'8:00 PM', isOpen:true,
    categories:['women','ethnic'], productCount:18,
    location:{lat:28.4550,lng:77.0350},
    images:{storefront:I.store1, featured:I.ethnic1, thumb1:I.ethnic2, thumb2:I.ethnic3}
  },
  {
    id:'shop-5', name:'Street Style Co.', ownerName:'Vikram Singh', phone:'+91 54321 09876',
    address:'9 Fashion Hub, Galleria', distance:'1.8 km', distanceNum:1.8,
    rating:4.3, reviewCount:67, arAvailable:true, verified:true,
    openTime:'11:00 AM', closeTime:'10:00 PM', isOpen:true,
    categories:['men','women','western'], productCount:15,
    location:{lat:28.4620,lng:77.0280},
    images:{storefront:I.mens1, featured:I.mens1, thumb1:I.mens2, thumb2:I.mens3}
  },
];

export const getShopById = id => shops.find(s => s.id === id) || null;
export const getShopsByCategory = c => (!c||c==='all') ? shops : shops.filter(s => s.categories.includes(c));
export const searchShops = q => { const l=q.toLowerCase(); return shops.filter(s => s.name.toLowerCase().includes(l)||s.address.toLowerCase().includes(l)); };
