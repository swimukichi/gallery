const works = [
  { id:"w001", title:"Work 01", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260120_082817_21ffd4b6-3b28-4128-bbd5-19233541853c.webp", tags:[], description:"", link:"" },
  { id:"w002", title:"Work 02", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260120_082921_0344e0ad-f412-4439-9d86-8ff2bc58d93e.webp", tags:[], description:"", link:"" },
  { id:"w003", title:"Work 03", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260121_041412_49c65254-5bb2-49a8-a18d-90b49a46e93b.webp", tags:[], description:"", link:"" },
  { id:"w004", title:"Work 04", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260121_041524_075fa954-a710-4304-b325-d40a27697eb1.webp", tags:[], description:"", link:"" },
  { id:"w005", title:"Work 05", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260121_042915_bdd6b8be-5cac-41f0-8d90-2ca02e01b574.webp", tags:[], description:"", link:"" },
  { id:"w006", title:"Work 06", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260121_043005_8707394d-53f9-4882-a8f6-e4a856ef83fb.webp", tags:[], description:"", link:"" },
  { id:"w007", title:"Work 07", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260121_065806_3d50ff51-7def-4658-82c3-cd3df8995021.webp", tags:[], description:"", link:"" },
  { id:"w008", title:"Work 08", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260121_065836_6a7dc2f1-f717-48f1-ac30-6efe23f05617.webp", tags:[], description:"", link:"" },
  { id:"w009", title:"Work 09", category:"concept",      aspectRatio:"1/1",  image:"images/hf_20260123_051301_146b528e-e1a8-4969-818c-062fa4b06f38.webp", tags:[], description:"", link:"" },
  { id:"w010", title:"Work 10", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260123_051321_35a4cdc4-9aee-492c-b10b-bf7e3a21bdb2.webp", tags:[], description:"", link:"" },
  { id:"w011", title:"Work 11", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260123_051346_66733cf4-14cd-40ed-841e-d8276a875043.webp", tags:[], description:"", link:"" },
  { id:"w012", title:"Work 12", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260123_145730_57ad5b8b-bb8c-413c-87fe-f4928940088a.webp", tags:[], description:"", link:"" },
  { id:"w013", title:"Work 13", category:"digital",      aspectRatio:"1/1",  image:"images/hf_20260123_145801_dfb01885-3295-4f6d-8412-d8ed5a674e30.webp", tags:[], description:"", link:"" },
  { id:"w014", title:"Work 14", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260123_145825_7b2ab359-8dd6-45db-931f-3481e3bcfba1.webp", tags:[], description:"", link:"" },
  { id:"w015", title:"Work 15", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260123_152352_8bcfcb19-9cd8-44a6-983e-e4c9a2a59364.webp", tags:[], description:"", link:"" },
  { id:"w016", title:"Work 16", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260124_072332_9a9d9490-640b-41e3-be8a-a6f4ed1153aa.webp", tags:[], description:"", link:"" },
  { id:"w017", title:"Work 17", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260124_072422_aea081a5-f675-44ff-83b3-298e5d9b37d0.webp", tags:[], description:"", link:"" },
  { id:"w018", title:"Work 18", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260124_072442_b5ca113b-e8f4-479e-854e-5ee114a49052.webp", tags:[], description:"", link:"" },
  { id:"w019", title:"Work 19", category:"mixed",        aspectRatio:"4/5",  image:"images/hf_20260124_082219_a7b426c4-e2ad-49a3-8fb0-c22f6a7678fb.webp", tags:[], description:"", link:"" },
  { id:"w020", title:"Work 20", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260125_032055_2a314d24-df8b-4fb1-b463-280a48e1809a.webp", tags:[], description:"", link:"" },
  { id:"w021", title:"Work 21", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260125_032110_4415cb7b-6572-4ae1-aa92-d945d534f533.webp", tags:[], description:"", link:"" },
  { id:"w022", title:"Work 22", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260125_032130_ca185632-b8e5-404f-afc5-afeb1031e25e.webp", tags:[], description:"", link:"" },
  { id:"w023", title:"Work 23", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260126_013629_2b456e14-d54c-406a-b1e2-9676a298b4b8.webp", tags:[], description:"", link:"" },
  { id:"w024", title:"Work 24", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260126_133649_30f9e3d0-ffad-4491-8451-ea313bf9c0f2.webp", tags:[], description:"", link:"" },
  { id:"w025", title:"Work 25", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260126_133705_9986f8b7-e9e0-4041-b22f-ea2abdc56c10.webp", tags:[], description:"", link:"" },
  { id:"w026", title:"Work 26", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260126_133730_5929d724-b33d-41c3-9784-72434ec8f238.webp", tags:[], description:"", link:"" },
  { id:"w027", title:"Work 27", category:"concept",      aspectRatio:"4/5",  image:"images/hf_20260126_133743_1f349f4d-51e9-4ea8-90a3-8efb589630ee.webp", tags:[], description:"", link:"" },
  { id:"w028", title:"Work 28", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260126_144004_f7a6f194-9a77-434d-826c-c66edb013e92.webp", tags:[], description:"", link:"" },
  { id:"w029", title:"Work 29", category:"mixed",        aspectRatio:"1/1",  image:"images/hf_20260126_145155_deef98ed-0413-4eb8-b2b6-335dc7dcf0f4.webp", tags:[], description:"", link:"" },
  { id:"w030", title:"Work 30", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260126_150413_ade93e32-7632-4fae-9768-36f82e8c7c0f.webp", tags:[], description:"", link:"" },
  { id:"w031", title:"Work 31", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260127_040109_3bf64f63-63fa-4a62-912f-ff931e6721ea.webp", tags:[], description:"", link:"" },
  { id:"w032", title:"Work 32", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260127_040123_5c913303-8251-450c-aace-37e5e89d9ba4.webp", tags:[], description:"", link:"" },
  { id:"w033", title:"Work 33", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260127_040146_4077b1b6-e4bc-4840-9c34-d6a7e9dada48.webp", tags:[], description:"", link:"" },
  { id:"w034", title:"Work 34", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260127_114649_16425aa4-2639-418c-90d6-9201a3a04d43.webp", tags:[], description:"", link:"" },
  { id:"w035", title:"Work 35", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260129_143011_ba5ac967-c63d-453d-bf01-37d57a7db0a2.webp", tags:[], description:"", link:"" },
  { id:"w036", title:"Work 36", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260129_143018_ae8ae387-8396-4763-a635-dab9e4702534.webp", tags:[], description:"", link:"" },
  { id:"w037", title:"Work 37", category:"mixed",        aspectRatio:"1/1",  image:"images/hf_20260130_003658_4177f8c9-ce63-4958-9d60-f344265bdfd9.webp", tags:[], description:"", link:"" },
  { id:"w038", title:"Work 38", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260130_005944_a209e775-8a6f-400e-9f72-90380ba8669e.webp", tags:[], description:"", link:"" },
  { id:"w039", title:"Work 39", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260130_011928_3bae4571-6b1f-4522-aca3-7ab4e6868d13.webp", tags:[], description:"", link:"" },
  { id:"w040", title:"Work 40", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260130_011944_6c647d96-a62a-48b6-befe-ddd653968e8c.webp", tags:[], description:"", link:"" },
  { id:"w041", title:"Work 41", category:"concept",      aspectRatio:"1/1",  image:"images/hf_20260130_012001_526a0536-69d6-4099-aacc-93f1f5dfc041.webp", tags:[], description:"", link:"" },
  { id:"w042", title:"Work 42", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260130_012733_47506688-e251-4855-b679-0cb6ac3aab93.webp", tags:[], description:"", link:"" },
  { id:"w043", title:"Work 43", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260130_015813_f42283bd-bf35-452b-a796-1247facd55f3.webp", tags:[], description:"", link:"" },
  { id:"w044", title:"Work 44", category:"mixed",        aspectRatio:"3/4",  image:"images/hf_20260130_042022_91c05e03-be20-445d-b99c-714773d6d6f4.webp", tags:[], description:"", link:"" },
  { id:"w045", title:"Work 45", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260130_042051_b7d79164-b7b5-4932-a674-e6d9efe8f55b.webp", tags:[], description:"", link:"" },
  { id:"w046", title:"Work 46", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260130_042113_ba291c12-2240-4a8c-aca0-cf1fbd16cb69.webp", tags:[], description:"", link:"" },
  { id:"w047", title:"Work 47", category:"concept",      aspectRatio:"4/5",  image:"images/hf_20260130_042258_9e27960c-9e35-4576-a32c-d0501fc95ce2.webp", tags:[], description:"", link:"" },
  { id:"w048", title:"Work 48", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260130_075848_063ced05-2237-4d8e-a002-c802c4c0d32d.webp", tags:[], description:"", link:"" },
  { id:"w049", title:"Work 49", category:"digital",      aspectRatio:"1/1",  image:"images/hf_20260130_075905_0512cd59-2a81-4100-b899-34418e0114f0.webp", tags:[], description:"", link:"" },
  { id:"w050", title:"Work 50", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260130_075921_e3e86e2b-1614-4bfe-a412-2537e1fda3a5.webp", tags:[], description:"", link:"" },
  { id:"w051", title:"Work 51", category:"concept",      aspectRatio:"4/5",  image:"images/hf_20260130_112701_1c1b950b-bd37-4ac1-85cd-1db18ca56267.webp", tags:[], description:"", link:"" },
  { id:"w052", title:"Work 52", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260131_044338_d9bdce8e-c236-4bed-bb73-7ac657477184.webp", tags:[], description:"", link:"" },
  { id:"w053", title:"Work 53", category:"digital",      aspectRatio:"1/1",  image:"images/hf_20260131_044355_5dd2a15a-5b76-48fe-8a75-d57a57dc4a3e.webp", tags:[], description:"", link:"" },
  { id:"w054", title:"Work 54", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260131_044408_08138bb8-3728-4ead-95e9-b1fdc97da7ff.webp", tags:[], description:"", link:"" },
  { id:"w055", title:"Work 55", category:"concept",      aspectRatio:"4/5",  image:"images/hf_20260131_102827_30b3f1cd-0e2e-4ad0-8dbf-c4bf9f540f9f.webp", tags:[], description:"", link:"" },
  { id:"w056", title:"Work 56", category:"mixed",        aspectRatio:"3/4",  image:"images/hf_20260131_231756_007fded8-d91d-4bb6-86cf-c503d648b486.webp", tags:[], description:"", link:"" },
  { id:"w057", title:"Work 57", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260131_231811_f5e2efbf-accb-47dc-a474-1939c1290dbb.webp", tags:[], description:"", link:"" },
  { id:"w058", title:"Work 58", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260131_231827_66f01e2d-d381-43f0-8f62-55feabd3871d.webp", tags:[], description:"", link:"" },
  { id:"w059", title:"Work 59", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260201_004744_81d77673-ec07-4903-9b4d-da5047a68a60.webp", tags:[], description:"", link:"" },
  { id:"w060", title:"Work 60", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260201_022756_5598d0d5-1244-40c5-9f59-cfdd90598f33.webp", tags:[], description:"", link:"" },
  { id:"w061", title:"Work 61", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260201_022818_e5e73ced-7d58-44f3-bf02-22ca727806f6.webp", tags:[], description:"", link:"" },
  { id:"w062", title:"Work 62", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260201_022842_31db685c-d2b8-4b74-90fb-984a38a699e9.webp", tags:[], description:"", link:"" },
  { id:"w063", title:"Work 63", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260201_023526_619d30ef-4df2-4f1e-bd12-2d8956127e71.webp", tags:[], description:"", link:"" },
  { id:"w064", title:"Work 64", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260201_023546_f3aeafe8-6e92-464f-8d83-2013a05a9ad3.webp", tags:[], description:"", link:"" },
  { id:"w065", title:"Work 65", category:"mixed",        aspectRatio:"1/1",  image:"images/hf_20260201_023601_1f9cfa52-6aec-47c5-9bf6-e67ac2fab650.webp", tags:[], description:"", link:"" },
  { id:"w066", title:"Work 66", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260201_051640_0db2a1ac-f431-4cb3-8bc1-fa727d69ac06.webp", tags:[], description:"", link:"" },
  { id:"w067", title:"Work 67", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260201_115812_71643895-7f03-4349-bf51-0e82e1dd0fea.webp", tags:[], description:"", link:"" },
  { id:"w068", title:"Work 68", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260201_115838_ad50019d-fce7-4e6d-bfba-f0ede803d144.webp", tags:[], description:"", link:"" },
  { id:"w069", title:"Work 69", category:"concept",      aspectRatio:"1/1",  image:"images/hf_20260201_115905_88eadec3-2cd8-4199-bff4-70ffd11e3ec0.webp", tags:[], description:"", link:"" },
  { id:"w070", title:"Work 70", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260201_131743_0d4e65c7-5716-438f-b9a0-b5cc3368f1fc.webp", tags:[], description:"", link:"" },
  { id:"w071", title:"Work 71", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260204_013142_c9e56c03-4d7b-46e0-b080-9bd6988f57f7.webp", tags:[], description:"", link:"" },
  { id:"w072", title:"Work 72", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260204_013204_084a1718-ee8b-4e83-8b36-2ab7e2fc25cb.webp", tags:[], description:"", link:"" },
  { id:"w073", title:"Work 73", category:"mixed",        aspectRatio:"1/1",  image:"images/hf_20260204_013249_94db3a31-cc5b-4d67-8ce5-839f63ef6ae6.webp", tags:[], description:"", link:"" },
  { id:"w074", title:"Work 74", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260204_070259_46066c67-dc37-4a4d-ae1e-11a0ad4d4626.webp", tags:[], description:"", link:"" },
  { id:"w075", title:"Work 75", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260206_032419_1967f584-e2c6-4ed0-bb6e-c0ae3ec4b967.webp", tags:[], description:"", link:"" },
  { id:"w076", title:"Work 76", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260206_032443_13ba61ef-5b92-4fe5-bbd7-fee6fe656bfb.webp", tags:[], description:"", link:"" },
  { id:"w077", title:"Work 77", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260206_032509_7dd80bdc-e03e-4853-989e-474b90d8ff06.webp", tags:[], description:"", link:"" },
  { id:"w078", title:"Work 78", category:"digital",      aspectRatio:"3/4",  image:"images/hf_20260206_032525_8b6b944e-687a-4af2-8651-9c589877f6ee.webp", tags:[], description:"", link:"" },
  { id:"w079", title:"Work 79", category:"illustration", aspectRatio:"4/5",  image:"images/hf_20260206_132615_a31e30bd-b332-444f-9129-58fd9c829438.webp", tags:[], description:"", link:"" },
  { id:"w080", title:"Work 80", category:"mixed",        aspectRatio:"3/4",  image:"images/hf_20260206_132632_589010ec-8be0-42e4-ad7b-b8bf200c13ec.webp", tags:[], description:"", link:"" },
  { id:"w081", title:"Work 81", category:"concept",      aspectRatio:"1/1",  image:"images/hf_20260206_132658_dc2d6fa6-82b3-48ac-a7ad-c2413a634e43.webp", tags:[], description:"", link:"" },
  { id:"w082", title:"Work 82", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260206_150301_bc2907f7-70ea-45ed-9d0e-567eb48bd914.webp", tags:[], description:"", link:"" },
  { id:"w083", title:"Work 83", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260208_113809_dc94666e-78aa-4443-9af1-f371aa474f75.webp", tags:[], description:"", link:"" },
  { id:"w084", title:"Work 84", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260208_114552_cb83dcb3-c3a5-41d2-a075-8d6bedb6e7df.webp", tags:[], description:"", link:"" },
  { id:"w085", title:"Work 85", category:"concept",      aspectRatio:"1/1",  image:"images/hf_20260208_114607_85670623-76e7-43b4-9f03-245b9f25dd50.webp", tags:[], description:"", link:"" },
  { id:"w086", title:"Work 86", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260209_024513_c73e3a26-4463-43f2-9460-b97eb26d007a.webp", tags:[], description:"", link:"" },
  { id:"w087", title:"Work 87", category:"digital",      aspectRatio:"4/5",  image:"images/hf_20260209_115531_3df9853b-3572-4020-9173-c9866c28946d.webp.webp", tags:[], description:"", link:"" },
  { id:"w088", title:"Work 88", category:"illustration", aspectRatio:"3/4",  image:"images/hf_20260209_130357_dc253656-24d1-458d-b1f0-c06a1af1e456.webp", tags:[], description:"", link:"" },
  { id:"w089", title:"Work 89", category:"mixed",        aspectRatio:"1/1",  image:"images/hf_20260209_130936_675a3979-38bc-43aa-9b9a-c3e672b23b78.webp", tags:[], description:"", link:"" },
  { id:"w090", title:"Work 090", category:"concept",      aspectRatio:"3/4",  image:"images/hf_20260209_132648_349f1150-aa1b-4778-a727-f59a6a45c3dc.webp", tags:[], description:"", link:"" },
  { id:"w091", title:"Work 091", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260210_022235_5c0818e1-6381-4ba3-9c8d-2baa3d5aa292.webp", tags:[], description:"", link:"" },
  { id:"w092", title:"Work 092", category:"digital", aspectRatio:"1/1", image:"images/hf_20260210_022251_e8b4e9d1-caa7-44e2-bb36-8bd1ca2e203c.webp", tags:[], description:"", link:"" },
  { id:"w093", title:"Work 093", category:"concept", aspectRatio:"4/5", image:"images/hf_20260210_022314_36c0a76f-8c9b-4221-93dc-670c8f58dc88.webp.webp", tags:[], description:"", link:"" },
  { id:"w094", title:"Work 094", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260210_033111_585454fa-70b9-448a-bdb3-84c33116c330.webp", tags:[], description:"", link:"" },
  { id:"w095", title:"Work 095", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260210_084317_aa8df67c-5527-43ca-a8ce-e38d0490c73e.webp.webp", tags:[], description:"", link:"" },
  { id:"w096", title:"Work 096", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260210_084332_6f6c3f2a-d4bd-430a-9071-f095b928ae5e.webp", tags:[], description:"", link:"" },
  { id:"w097", title:"Work 097", category:"digital", aspectRatio:"3/4", image:"images/hf_20260210_084353_54eb4256-3908-482c-b6fd-113dcd2b13e8.webp", tags:[], description:"", link:"" },
  { id:"w098", title:"Work 098", category:"concept", aspectRatio:"3/2", image:"images/hf_20260210_111211_617e046e-c286-431e-ac1f-7417f1ed8dd0.webp", tags:[], description:"", link:"" },
  { id:"w099", title:"Work 099", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260211_042018_ffb1b827-1922-40ec-b8f4-f323f5225ae5.webp.webp", tags:[], description:"", link:"" },
  { id:"w100", title:"Work 100", category:"digital", aspectRatio:"1/1", image:"images/hf_20260211_093003_5db1e330-4f7e-400f-b81b-b02432eb7da4.webp.webp", tags:[], description:"", link:"" },
  { id:"w101", title:"Work 101", category:"concept", aspectRatio:"4/5", image:"images/hf_20260211_093036_a1462b04-fa9c-4176-b5bb-6b83db64d025.webp.webp", tags:[], description:"", link:"" },
  { id:"w102", title:"Work 102", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260211_093048_5507a89e-e6b3-4144-bf6f-b6e7e97abdca.webp.webp", tags:[], description:"", link:"" },
  { id:"w103", title:"Work 103", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260211_094454_c1e8d296-e627-44ee-85b4-1fd1c5329ca0.webp.webp", tags:[], description:"", link:"" },
  { id:"w104", title:"Work 104", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260211_141018_02862855-302c-4e49-9fc3-844645ecfa7d.webp.webp", tags:[], description:"", link:"" },
  { id:"w105", title:"Work 105", category:"digital", aspectRatio:"3/4", image:"images/hf_20260211_141038_077e0207-277f-4e55-8537-379bdef43a4c.webp", tags:[], description:"", link:"" },
  { id:"w106", title:"Work 106", category:"concept", aspectRatio:"3/2", image:"images/hf_20260211_141056_845a371f-de26-42e3-adfe-3fac6cbaed0b.webp.webp", tags:[], description:"", link:"" },
  { id:"w107", title:"Work 107", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260213_094824_74eb9ccc-c309-4934-847e-0548425e37ed.webp", tags:[], description:"", link:"" },
  { id:"w108", title:"Work 108", category:"digital", aspectRatio:"1/1", image:"images/hf_20260213_094900_a2ea71df-67f1-4088-82d8-fe3a3e98a0bb.webp", tags:[], description:"", link:"" },
  { id:"w109", title:"Work 109", category:"concept", aspectRatio:"4/5", image:"images/hf_20260213_094920_a03010b8-83d6-48f8-b8df-bba3a27e8e52.webp", tags:[], description:"", link:"" },
  { id:"w110", title:"Work 110", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260214_045928_54e6ec93-e2ff-426c-840c-828befe509ed.webp", tags:[], description:"", link:"" },
  { id:"w111", title:"Work 111", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260214_113758_ea4fa238-f14f-4907-8ac6-886889e8af50.webp", tags:[], description:"", link:"" },
  { id:"w112", title:"Work 112", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260214_113813_a6a6a4dd-66e2-4c28-897e-d3b8d14a4a22.webp", tags:[], description:"", link:"" },
  { id:"w113", title:"Work 113", category:"digital", aspectRatio:"3/4", image:"images/hf_20260214_113830_719f89fa-28c4-4791-8227-edc02d8a3a11.webp", tags:[], description:"", link:"" },
  { id:"w114", title:"Work 114", category:"concept", aspectRatio:"3/2", image:"images/hf_20260215_015358_8fedd7c9-a36b-4442-8885-b55c05b45b72.webp", tags:[], description:"", link:"" },
  { id:"w115", title:"Work 115", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260215_023654_04e9c263-73d1-45ea-ae50-26d14a280c30.webp", tags:[], description:"", link:"" },
  { id:"w116", title:"Work 116", category:"digital", aspectRatio:"1/1", image:"images/hf_20260215_023710_ba517761-af4e-4463-aff1-bcc583e25bb1.webp", tags:[], description:"", link:"" },
  { id:"w117", title:"Work 117", category:"concept", aspectRatio:"4/5", image:"images/hf_20260215_023726_cf0aa023-15e9-4d39-8f9f-a78234768e0a.webp", tags:[], description:"", link:"" },
  { id:"w118", title:"Work 118", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260215_025604_9531ee03-1322-438f-8f9e-dd17d984434e.webp", tags:[], description:"", link:"" },
  { id:"w119", title:"Work 119", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260215_025622_0def2c25-c1f6-4def-9727-df1a400b6e36.webp", tags:[], description:"", link:"" },
  { id:"w120", title:"Work 120", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260215_025635_65516c9c-ea12-4a96-a139-e09deabad1d6.webp", tags:[], description:"", link:"" },
  { id:"w121", title:"Work 121", category:"digital", aspectRatio:"3/4", image:"images/hf_20260215_034000_9545935e-c9ad-47d2-8292-51fe195192db.webp", tags:[], description:"", link:"" },
  { id:"w122", title:"Work 122", category:"concept", aspectRatio:"3/2", image:"images/hf_20260215_051020_63c7d836-ab70-4497-8b52-5cebb3fbbc63.webp", tags:[], description:"", link:"" },
  { id:"w123", title:"Work 123", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260215_051044_5f6b1f5c-6f39-4006-979e-87cc955a2918.webp", tags:[], description:"", link:"" },
  { id:"w124", title:"Work 124", category:"digital", aspectRatio:"1/1", image:"images/hf_20260215_051057_c81e7332-e726-4491-9b79-7ca5430a89c0.webp", tags:[], description:"", link:"" },
  { id:"w125", title:"Work 125", category:"concept", aspectRatio:"4/5", image:"images/hf_20260215_060259_25611d2d-ec26-45aa-a35d-f62c2e6a2b09.webp", tags:[], description:"", link:"" },
  { id:"w126", title:"Work 126", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260215_091740_a094f8f3-8fbd-4edf-9b87-147408b997b9.webp", tags:[], description:"", link:"" },
  { id:"w127", title:"Work 127", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260215_100243_293f1182-0f45-41f9-856a-ab9f04035f49.webp", tags:[], description:"", link:"" },
  { id:"w128", title:"Work 128", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260215_150519_216f6828-1922-4e54-9fcf-15c35bc58c8d.webp", tags:[], description:"", link:"" },
  { id:"w129", title:"Work 129", category:"digital", aspectRatio:"3/4", image:"images/hf_20260215_151942_ac8e5426-d1b8-423e-8c77-2cbbcbdb09a8.webp", tags:[], description:"", link:"" },
  { id:"w130", title:"《家の神経節》", category:"concept", aspectRatio:"3/2", image:"images/hf_20260216_011044_2fd9fc40-b113-4234-b9c9-0f41dd20d242.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w131", title:"《家の神経節》", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260216_011102_4d742c64-c5ff-4388-aebe-99f6bad499dc.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w132", title:"《家の神経節》", category:"digital", aspectRatio:"1/1", image:"images/hf_20260216_042818_44268687-26fe-49c6-b439-424406e214d6.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w133", title:"《家の神経節》", category:"concept", aspectRatio:"4/5", image:"images/hf_20260216_042842_15ea3af5-4ec6-4eb1-ac58-6987fc2c08cb.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w134", title:"《家の神経節》", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260216_062841_7e40ab2e-f8e9-469e-b829-eabd2da78e41.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w135", title:"《家の神経節》", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260216_062906_bdf07163-23dc-4c80-a5b0-ebbe95dfa2bb.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w136", title:"《家の神経節》", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260216_063006_7e02e36a-4e9f-4893-bf4e-368b2968e4dc.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w137", title:"《家の神経節》", category:"digital", aspectRatio:"3/4", image:"images/hf_20260216_070056_52781c59-a13c-46c6-bbca-e21a708ccd0f.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w138", title:"《家の神経節》", category:"concept", aspectRatio:"3/2", image:"images/hf_20260216_135847_06556f0a-ded2-41a4-9d7c-c2624b221a16.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w139", title:"《家の神経節》", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260216_135958_3a31c25d-9a26-4823-a590-5d545d4f02cc.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w140", title:"《家の神経節》", category:"digital", aspectRatio:"1/1", image:"images/hf_20260216_140149_9450e474-caf6-4940-baaf-579f2f368a0d.webp", tags:[], description:"点滅は痙攣で、再起動は蘇生だ。", link:"" },
  { id:"w141", title:"《足元の血管》", category:"concept", aspectRatio:"4/5", image:"images/hf_20260217_115028_1373910c-c4d6-4aac-80d2-913d7abaf272.webp", tags:[], description:"分岐は毛細血管になり、絡まりは静脈瘤になる。", link:"" },
  { id:"w142", title:"《足元の血管》", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260217_141344_0847e514-f0bd-4841-a128-efce0576be5d.webp", tags:[], description:"分岐は毛細血管になり、絡まりは静脈瘤になる。", link:"" },
  { id:"w143", title:"《家の声帯》", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260220_072044_58c3290a-ab18-4d2f-ad55-ab5a310af3dc.webp", tags:[], description:"あなたの声じゃないのに、部屋の沈黙を発声に変えていく。", link:"" },
  { id:"w144", title:"《家の声帯》", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260220_072111_beb06f2b-424e-4103-8eb5-202a608f55c9.webp.webp", tags:[], description:"あなたの声じゃないのに、部屋の沈黙を発声に変えていく。", link:"" },
  { id:"w145", title:"《家の声帯》", category:"digital", aspectRatio:"3/4", image:"images/hf_20260220_072135_3e7ed19f-e9bb-418d-8c7d-235d53e0130d.webp", tags:[], description:"あなたの声じゃないのに、部屋の沈黙を発声に変えていく。", link:"" },
  { id:"w146", title:"《家の声帯》", category:"concept", aspectRatio:"3/2", image:"images/hf_20260220_072206_7326d0c6-dcec-44d3-9a1b-b04678f769c4.webp.webp", tags:[], description:"あなたの声じゃないのに、部屋の沈黙を発声に変えていく。", link:"" },
  { id:"w147", title:"《審判の舌》", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260221_083049_19312701-9dca-4594-963e-a918291bb4a4.webp.webp", tags:[], description:"毎朝、肉体を点数に変える儀式が始まる。", link:"" },
  { id:"w148", title:"《審判の舌》", category:"digital", aspectRatio:"1/1", image:"images/hf_20260221_083122_f804dffa-419c-4668-8e6b-77acb709673b.webp", tags:[], description:"毎朝、肉体を点数に変える儀式が始まる。", link:"" },
  { id:"w149", title:"《審判の舌》", category:"concept", aspectRatio:"4/5", image:"images/hf_20260221_083206_6cdf8656-85ec-4d4a-b46f-fe4c6b96f163.webp.webp", tags:[], description:"毎朝、肉体を点数に変える儀式が始まる。", link:"" },
  { id:"w150", title:"《口内穿孔虫》", category:"mixed", aspectRatio:"3/4", image:"images/hf_20260222_021856_0c00562e-acc6-45c5-9557-5d5168d17443.webp.webp", tags:[], description:"振動は穿孔になり、血は正常反応として学習される。", link:"" },
  { id:"w151", title:"《口内穿孔虫》", category:"illustration", aspectRatio:"1/1", image:"images/hf_20260222_124948_67c468d1-4e6a-4f09-ba40-8c3eb428389f.webp.webp", tags:[], description:"振動は穿孔になり、血は正常反応として学習される。", link:"" },
  { id:"w152", title:"《口内穿孔虫》", category:"illustration", aspectRatio:"4/5", image:"images/hf_20260222_125003_83ad36cd-9071-4685-9824-bb2f631ebd2a.webp", tags:[], description:"振動は穿孔になり、血は正常反応として学習される。", link:"" },
  { id:"w153", title:"《口内穿孔虫》", category:"digital", aspectRatio:"3/4", image:"images/hf_20260222_125249_44534081-146c-4b3a-92f7-15273a356ee5.webp.webp", tags:[], description:"振動は穿孔になり、血は正常反応として学習される。", link:"" },
  { id:"w154", title:"《口内穿孔虫》", category:"concept", aspectRatio:"3/2", image:"images/hf_20260222_130454_07750f81-e514-4ee7-b454-17e52493f069.webp.webp", tags:[], description:"振動は穿孔になり、血は正常反応として学習される。", link:"" },
  { id:"w155", title:"《熱風の肺》", category:"illustration", aspectRatio:"3/4", image:"images/hf_20260223_101931_e79d8e7e-8a17-4da8-8c77-868982ec3b4a.webp.webp", tags:[], description:"温風は呼気になり、吸気口は逆流する舌になる。", link:"" },
  { id:"w156", title:"《熱風の肺》", category:"digital", aspectRatio:"1/1", image:"images/hf_20260223_101952_4261d9b9-671e-4c95-90a8-07a83d6e427a.webp.webp", tags:[], description:"温風は呼気になり、吸気口は逆流する舌になる。", link:"" },
  { id:"w157", title:"《熱風の肺》", category:"concept", aspectRatio:"4/5", image:"images/hf_20260223_102010_f10c7b39-8c09-4b53-8b77-ddcf0b869901.webp", tags:[], description:"温風は呼気になり、吸気口は逆流する舌になる。", link:"" },
{ id:"w158", title:"《神縫裂腱》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260311_110311_d743c05c-adf9-4226-a409-efd051384b75.jpeg.webp", tags:[], description:"神に縫われた腱は、切れるために存在している。", link:"" },
  { id:"w159", title:"《採葉神経樹》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260310_234522_42a9c10a-251e-4c3e-8a77-71e7fa5e4e09.webp", tags:[], description:"世界を支えているのではなく、世界から情報を吸い上げている。", link:"" },
  { id:"w160", title:"《採葉神経樹》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260310_234544_9c5fbd21-8933-496e-9eeb-a7016b1ade6b.webp", tags:[], description:"世界を支えているのではなく、世界から情報を吸い上げている。", link:"" },
  { id:"w161", title:"《採葉神経樹》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260310_234605_3dbb9150-fe5d-4d1b-a1c6-28372da3502c.webp", tags:[], description:"世界を支えているのではなく、世界から情報を吸い上げている。", link:"" },
  { id:"w162", title:"《神縫裂腱》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260311_110249_7e99b095-0841-4158-8f1a-c07c91e12443.jpeg.webp", tags:[], description:"神に縫われた腱は、切れるために存在している。", link:"" },
  { id:"w163", title:"《神縫裂腱》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260311_110209_8ec901b8-4809-404c-b42b-143f117d304d.jpeg.webp", tags:[], description:"神に縫われた腱は、切れるために存在している。", link:"" },
  { id:"w164", title:"《神縫裂腱》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260311_110227_43d478cb-3f22-434a-9dbf-edf86b44db7f.jpeg.webp", tags:[], description:"神に縫われた腱は、切れるために存在している。", link:"" },
{ id:"w165", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_012213_fca36ed5-7df5-417f-9b5a-f51c060bd78c.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w166", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_012238_cc0192b9-4015-4b5e-a39c-7153fd59def7.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w167", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"3/2",  image:"images/hf_20260321_012330_c95338f2-6fc8-4fb7-b340-c9f7e90a5004.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w168", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_012358_096933a2-f46e-4d44-82be-0463fb91a644.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w169", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"3/2",  image:"images/hf_20260321_105713_0a508b84-961c-47a1-befb-60e06995e700.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w170", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"3/2",  image:"images/hf_20260321_105739_e63b0aaf-d9a2-4113-9710-6b840422fbd1.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w171", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_105849_a840b109-3898-4a4c-8107-3658fff970f5.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w172", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_111739_8b3113ad-d338-4432-a2a8-e5a86a34312e.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w173", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_111805_6ed82b1b-13e3-4a3d-a8fd-a7ded7eac2ad.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w194", title:"《補修饗宴》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260318_123942_28ee0f56-8579-498a-b933-3d59ee46e4b1.jpeg.webp", tags:[], description:"死者が集うのではなく、戦える状態に修復される場所だ。", link:"" },
  { id:"w195", title:"《補修饗宴》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260318_124009_b0006a22-dc11-45bb-b837-48edb0c43834.jpeg.webp", tags:[], description:"死者が集うのではなく、戦える状態に修復される場所だ。", link:"" },
  { id:"w196", title:"《補修饗宴》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260318_124033_6f78ff0c-38a2-4aee-8097-d363c1411e7e.jpeg.webp", tags:[], description:"死者が集うのではなく、戦える状態に修復される場所だ。", link:"" },
  { id:"w197", title:"《補修饗宴》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260318_124106_22668af9-6c50-4598-aead-b0c439cdb6ec.jpeg.webp", tags:[], description:"死者が集うのではなく、戦える状態に修復される場所だ。", link:"" },
  { id:"w198", title:"《代償の生体レンズ》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260319_004411_ad60a9f7-fd9f-46c3-9968-6d0daf18abae.webp", tags:[], description:"捧げられた眼は、まだ脈打ちながら外界を記録している。", link:"" },
  { id:"w199", title:"《沈黙信号塔》", category:"illustration", aspectRatio:"16/9", image:"images/hf_20260321_012305_1033969a-3f5c-45be-bed1-cd292d4044ef.jpeg.webp", tags:[], description:"葉の先端から、ずっと何かを送信している。", link:"" },
  { id:"w200", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_055209_dd0a53c3-f7ef-4c20-85e2-2c61ab14d070.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w201", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_055230_0371c44e-2519-4f06-8f03-c1bb87cc4ad1.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w202", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_055300_2c7d8c39-5cf3-42d6-8103-e00586cfe316.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w203", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_055827_885b819b-a4ad-4029-8a6d-491f33cb51de.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w204", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_062136_02ccbe57-0f6d-431e-a52a-0025495bd7a6.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w205", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_062150_d8d2c9eb-9245-45e0-bc10-34b70779cd77.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w206", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_062203_850693f4-79b2-48e0-a4ca-cc2204926569.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w207", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_062221_ff3e5564-2e77-408e-99f9-7c24f39eef46.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w208", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_145630_022a533b-dbdd-477e-af1e-788c77c73654.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w209", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_145704_1520a8ee-65e3-4aff-9376-cbec71d25d25.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w210", title:"《死後稼働翼》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260328_145725_78955fcf-f888-46cc-8078-7c813a86fc6a.webp", tags:[], description:"止まった瞬間に落ちる。だから、永遠に羽ばたく。", link:"" },
  { id:"w211", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_004432_5cc07b93-c4d4-4f7e-b408-3a95d396c2b4.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w212", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_004454_5f4ad469-fd26-4967-95e7-99822c528b47.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w213", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_004517_e3066232-b1d5-461e-a102-90cc48b7c15e.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w214", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_004541_6d79cbfd-b26e-45be-a388-b9c4cd99e2e7.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w215", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_044535_ed6b3631-b422-4367-b900-dd2c1a94f832.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w216", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_052315_a1b203c0-f0dc-4dd6-8c0f-370ed1d6672d.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w217", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_052335_bf685707-c513-417e-8ff5-e547a67a2bef.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w218", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_052354_c91aa948-acc0-455e-ada5-39598bcc980e.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w219", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_052417_c671a472-a457-4637-b154-a58ce4517e98.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w220", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_060924_670f6d12-9b06-419d-8f9e-58383f2bab75.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w221", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_073136_8079232b-cb5f-496e-9891-7ad089f2fc1f.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w222", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_075739_28197a52-141f-41c1-87d4-bc96de1666fd.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w223", title:"《踏砕復讐足》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260329_075805_9783eb2b-560e-4b40-85b2-cbb1bec233d3.webp", tags:[], description:"履くのではなく、待つことで足に生えてくる。", link:"" },
  { id:"w224", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044440_785eb62d-d9c3-48e6-b45e-f51414d0647c.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w225", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044507_4dca9e1b-1e1e-472a-a267-49e7381a1df5.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w226", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044738_1be3d351-29d1-497b-a0e0-8f23c683647f.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w227", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044807_3879fa1f-7821-4991-8dd1-4b7a85c79dd3.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w228", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044843_4ff58926-6f55-4c9d-bca7-5fd7480b3cea.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w229", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_044907_1c611449-040f-496d-ba0a-ba212ac03777.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w230", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_080158_9b17f0df-d753-4275-a213-75a80d402b7b.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w231", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_093528_7dad65ed-0809-4357-b2e9-3779cf6581ed.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w232", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_093555_22ad5b68-82e2-4013-956f-5ea9a9594cf8.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w233", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_093620_e1527394-e17b-4830-a631-db2f121035ea.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w234", title:"《永続咀嚼体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260330_093645_05fd3e3d-aa04-46b3-b09f-8134461b177c.webp", tags:[], description:"やめた瞬間に消えるから、噛み続けている。", link:"" },
  { id:"w235", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_003817_b573d81e-f577-4b43-b1b0-1421757e1099.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w236", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_003850_46b060a5-0a89-4046-87e2-c0f9691e48a7.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w237", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_003954_cd32594c-3f75-4b64-8499-a265129eee4d.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w238", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_004027_cb3f7318-afe3-4f30-93a2-9158d77cf465.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w239", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_005001_712c6e92-88eb-408e-933a-f2ef91086a36.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w240", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_005941_7a9f39b3-7ac4-4556-872c-0412ad7e5a3c.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w241", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_025320_3161d2ec-60a3-4e52-b147-ef55d607e6e1.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w242", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_025352_702d46a5-6b96-43a1-9d1e-035b02139b74.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w243", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_030814_aa80b3bf-26ca-48c3-aea9-bae14bf91c78.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w244", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_053554_53dfde42-4d87-4e49-a86a-09b7fa3427a7.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w245", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_053635_8a607e06-6736-43bb-a83f-a28006812466.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w246", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_054242_37b5cd54-a13e-4b83-8814-66d51ab209cc.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w247", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_110024_d9cc5baf-cd80-4580-8ad6-4686d6ded829.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w248", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_110053_b99e2ea8-72cd-4cde-931b-d1f84e2c071b.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w249", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_110127_26c3c773-73f0-4160-8f89-248b35780316.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w250", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_145054_4494e93e-80a5-4c0f-9d00-efb3d0887ee5.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w251", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_145121_ad1136ab-74c8-47f2-b911-6bb466101248.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w252", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_145147_1c246100-90ac-4cbf-b963-939602dc0271.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w253", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_145231_9fb49c82-a277-4edc-976a-eebd4bc08553.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w254", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_233249_b61526a2-57cd-4c12-a017-7930dd4f4b8e.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w255", title:"《石化放射体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260331_233317_0d679e3b-a5ca-49f0-8475-a87310b1e3b6.webp", tags:[], description:"切断された後の方が、器官として完成した。", link:"" },
  { id:"w256", title:"《双液分泌体》", category:"illustration", aspectRatio:"1/1",  image:"images/hf_20260401_010551_2be3365f-b99a-4e75-ba1b-e72dac58db5a.webp", tags:[], description:"どちらが出るかを、身体が決める。", link:"" },
  { id:"w257", title:"Work 257", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260309%20025641%20C2ba1331-Ed18-4107-B849-8B04b6019a59.mp4", tags:[], description:"", link:"" },
  { id:"w258", title:"Work 258", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260309%20031100%2096159Da7-7Ee8-4D73-A2e4-C412fd127096.mp4", tags:[], description:"", link:"" },
  { id:"w259", title:"Work 259", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260315%20045226%201390F80d-94E1-46A7-8Bb9-2Cacbd0496f6.mp4", tags:[], description:"", link:"" },
  { id:"w260", title:"Work 260", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260315%20063528%20C1d8d360-3Db7-44F1-8Ac6-90Bb50ac4ad7.mp4", tags:[], description:"", link:"" },
  { id:"w261", title:"Work 261", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260317%20025515%207402B4c4-C252-4Bef-8834-497Eb42552eb.mp4", tags:[], description:"", link:"" },
  { id:"w262", title:"Work 262", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260317%20134305%20A748f81e-52Fb-49Fc-83C2-D1fff647a1e7.mp4", tags:[], description:"", link:"" },
  { id:"w263", title:"Work 263", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260317%20221648%20B6cbfd07-8D36-4318-84E5-4E6fbbbf120d.mp4", tags:[], description:"", link:"" },
  { id:"w264", title:"Work 264", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260317%20221719%20013D850e-0094-4797-A14d-032121B28c80.mp4", tags:[], description:"", link:"" },
  { id:"w265", title:"Work 265", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260321%20050736%209F3293bf-F618-4Da0-9404-Aa3f7f155eeb.mp4", tags:[], description:"", link:"" },
  { id:"w266", title:"Work 266", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260321%20122832%209D8fbcbf-1C70-4D28-96A8-7F298f58ea1d.mp4", tags:[], description:"", link:"" },
  { id:"w267", title:"Work 267", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260323%20033446%20632A574d-48A7-469D-8300-6A0a57b8ffb0.mp4", tags:[], description:"", link:"" },
  { id:"w268", title:"Work 268", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260323%20084237%208Ce9cf90-Ad67-4F2d-A214-77A8ac03ffcb.mp4", tags:[], description:"", link:"" },
  { id:"w269", title:"Work 269", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260324%20104000%20D53cbae1-6986-45Fd-92Ed-3Aa9ba557989.mp4", tags:[], description:"", link:"" },
  { id:"w270", title:"Work 270", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260326%20024222%200565A8cc-068E-4027-B2f1-3E71b468b266.mp4", tags:[], description:"", link:"" },
  { id:"w271", title:"Work 271", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260328%20062010%202Ac39e3e-4C54-40Da-9946-70C6d90693e4.mp4", tags:[], description:"", link:"" },
  { id:"w272", title:"Work 272", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260328%20063500%20C85aac1a-Cf21-473C-8Ce6-603F74fb955e.mp4", tags:[], description:"", link:"" },
  { id:"w273", title:"Work 273", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260329%20073746%2036345Fe9-Dfb0-4C62-Ac57-6442B57011e5.mp4", tags:[], description:"", link:"" },
  { id:"w274", title:"Work 274", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260330%20110629%20606Eea58-7061-46B1-9Ec2-F43347fea5e1.mp4", tags:[], description:"", link:"" },
  { id:"w275", title:"Work 275", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260331%20013213%20Dbc167e1-47F6-412E-Bcc1-4B6020117292.mp4", tags:[], description:"", link:"" },
  { id:"w276", title:"Work 276", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260331%20064056%20149Fa77d-973C-45F2-8Ad6-814501D55bae.mp4", tags:[], description:"", link:"" },
  { id:"w277", title:"Work 277", category:"digital",      aspectRatio:"9/16", video:"Videos/Hf%2020260331%20092600%20B7fe5512-048E-493B-A719-6A181e62c546.mp4", tags:[], description:"", link:"" },
];
works.sort((a, b) => {
  const date = w => {
    const src = w.image || w.video || '';
    return (src.match(/(\d{8})[_ ](\d{6})/i) || ['','',''])[1] + (src.match(/(\d{8})[_ ](\d{6})/i) || ['','',''])[2];
  };
  return date(b).localeCompare(date(a));
});
/* =============================================
   DOM 参照
   ============================================= */
const galleryGrid  = document.getElementById('galleryGrid');
const noResults    = document.getElementById('noResults');
const workCount    = document.getElementById('workCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const filterBtns   = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let lastFocused   = null;

const categoryLabel = {
  illustration: 'Illustration',
  digital:      'Digital',
  concept:      'Concept',
  mixed:        'Mixed Media',
};

/* =============================================
   カード生成
   ============================================= */
function buildCard(work, index) {
  const el = document.createElement('article');
  el.className = 'work-card';
  el.tabIndex  = 0;
  el.dataset.category = work.category;
  el.setAttribute('aria-label', `${work.title} — ${categoryLabel[work.category] ?? work.category}`);
  el.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`;

  const ratio = work.aspectRatio ?? '3/4';
  const catLabel = categoryLabel[work.category] ?? work.category;

  let mediaHTML = '';
  if (work.youtube) {
    const thumb    = `https://img.youtube.com/vi/${work.youtube}/maxresdefault.jpg`;
    const fallback = `https://img.youtube.com/vi/${work.youtube}/hqdefault.jpg`;
    mediaHTML = `<div class="card-media thumb-wrap" style="aspect-ratio:${ratio}">
      <img src="${thumb}" alt="${work.title}" loading="lazy" onerror="this.src='${fallback}'">
      <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
        <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
      </div></div></div>`;
  } else if (work.video) {
    mediaHTML = `<div class="card-media thumb-wrap" style="aspect-ratio:${ratio}">
      <video src="${work.video}" muted playsinline preload="metadata" class="card-video-thumb"></video>
      <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
        <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
      </div></div></div>`;
  } else if (work.image) {
    mediaHTML = `<div class="card-media" style="aspect-ratio:${ratio}">
      <img src="${work.image}" alt="${work.title}" loading="lazy">
    </div>`;
  } else {
    mediaHTML = `<div class="card-media" style="aspect-ratio:${ratio};background:#111;display:flex;align-items:center;justify-content:center;">
      <span style="font-family:var(--serif);font-style:italic;font-size:13px;color:#2a2a2a;">${work.title}</span>
    </div>`;
  }

  el.innerHTML = `${mediaHTML}
    <div class="card-bar" aria-hidden="true">
      <span class="card-cat">${catLabel}</span>
      <span class="card-plus">+</span>
    </div>`;

  const cardMedia = el.querySelector('.card-media');
  if (cardMedia) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `<span class="card-overlay-title">${work.title}</span>${work.description ? `<span class="card-overlay-desc">${work.description}</span>` : ''}`;
    cardMedia.appendChild(overlay);
  }

  const open = () => openModal(work, el);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
  return el;
}

/* =============================================
   グリッド描画
   ============================================= */
function renderGallery(filter = 'all') {
  galleryGrid.innerHTML = '';
  const filtered = filter === 'all' ? works : works.filter(w => w.category === filter);
  workCount.textContent = filtered.length;
  if (filtered.length === 0) { noResults.hidden = false; return; }
  noResults.hidden = true;
  filtered.forEach((work, i) => galleryGrid.appendChild(buildCard(work, i)));
}

/* =============================================
   フィルター
   ============================================= */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    renderGallery(currentFilter);
  });
});

/* =============================================
   モーダル open
   ============================================= */
function openModal(work, trigger) {
  lastFocused = trigger;
  const mediaEl = document.getElementById('modalMedia');

  if (work.youtube) {
    mediaEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${work.youtube}?autoplay=1&mute=1&rel=0"
      title="${work.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  } else if (work.video) {
    mediaEl.innerHTML = `<video src="${work.video}" controls autoplay muted playsinline></video>`;
  } else if (work.image) {
    mediaEl.innerHTML = `<img src="${work.image}" alt="${work.title}">`;
  } else {
    mediaEl.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0d0d0d;">
      <span style="font-family:var(--serif);font-style:italic;font-size:18px;color:#333;">${work.title}</span></div>`;
  }

  const tagRow   = document.getElementById('modalTagRow');
  const catLabel = categoryLabel[work.category] ?? work.category;
  tagRow.innerHTML = `<span class="modal-tag is-category">${catLabel}</span>`
    + (work.tags ?? []).map(t => `<span class="modal-tag is-regular">${t}</span>`).join('');

  document.getElementById('modalTitle').textContent       = work.title;
  document.getElementById('modalDescription').textContent = work.description ?? '';

  const dl = document.getElementById('modalDl');
  let dlHTML = '';
  if (work.year)         dlHTML += `<dt>Year</dt><dd>${work.year}</dd>`;
  if (work.tools?.length) dlHTML += `<dt>Tools</dt><dd>${work.tools.join(', ')}</dd>`;
  dl.innerHTML = dlHTML;
  dl.hidden = !dlHTML;

  const linkEl = document.getElementById('modalLink');
  if (work.link) { linkEl.href = work.link; linkEl.hidden = false; }
  else { linkEl.hidden = true; }

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modalClose.focus());
}

/* =============================================
   モーダル close
   ============================================= */
function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const iframe = modalOverlay.querySelector('iframe');
  if (iframe) iframe.src = '';
  if (lastFocused) { lastFocused.focus(); lastFocused = null; }
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
});

modalOverlay.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = [...modalOverlay.querySelectorAll('button:not([disabled]),[href],iframe,[tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* =============================================
   初期化
   ============================================= */
renderGallery('all');
const i18n = {
  ja: {
    logoSub: 'Art & Illustration',
    about1: '日常にあるものが、静かに変質していく。',
    about2: '家電、植物、生活用品——見慣れたものの内側に、',
    about3: '生体機械としての構造を見出し、異形として記録している。',
    aboutSub: 'Biomechanical mutation of everyday objects. Tinged with horror.',
    works: 'WORKS', note: 'NOTE', video: 'VIDEO',
    worksLabel: ' works',
    all: 'All', illustration: 'Illustration', digital: 'Digital',
    concept: 'Concept', mixed: 'Mixed Media',
    latestLog: 'LATEST LOG', magazineLink: 'マガジンを見る ↗',
    videoWorks: 'VIDEO WORKS',
  },
  en: {
    logoSub: 'Art & Illustration',
    about1: 'Everyday objects quietly mutate.',
    about2: 'Appliances, plants, household items——',
    about3: 'I find biomechanical structures within the familiar, and record them as aberrations.',
    aboutSub: 'Biomechanical mutation of everyday objects. Tinged with horror.',
    works: 'WORKS', note: 'NOTE', video: 'VIDEO',
    worksLabel: ' works',
    all: 'All', illustration: 'Illustration', digital: 'Digital',
    concept: 'Concept', mixed: 'Mixed Media',
    latestLog: 'LATEST LOG', magazineLink: 'View Magazine ↗',
    videoWorks: 'VIDEO WORKS',
  },
  zh: {
    logoSub: '艺术 & 插画',
    about1: '日常之物，悄然异变。',
    about2: '家电、植物、生活用品——',
    about3: '在熟悉之物的内部，发现生体机械的构造，以异形之姿记录。',
    aboutSub: '日常之物的生体机械异变。带有恐惧色彩。',
    works: '作品', note: '笔记', video: '影像',
    worksLabel: ' 件',
    all: '全部', illustration: '插画', digital: '数字',
    concept: '概念', mixed: '综合媒材',
    latestLog: '最新日志', magazineLink: '查看杂志 ↗',
    videoWorks: '影像作品',
  },
};

function setLang(lang) {
  const t = i18n[lang];
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.querySelector('.logo-sub').textContent = t.logoSub;
  const aboutTexts = document.querySelectorAll('.about-text-line');
  if (aboutTexts.length >= 3) {
    aboutTexts[0].textContent = t.about1;
    aboutTexts[1].textContent = t.about2;
    aboutTexts[2].textContent = t.about3;
  }
  const aboutSub = document.querySelector('.about-sub');
  if (aboutSub) aboutSub.textContent = t.aboutSub;
  document.querySelector('[data-page="works"]').textContent = t.works;
  document.querySelector('[data-page="note"]').textContent = t.note;
  document.querySelector('[data-page="video"]').textContent = t.video;
  document.querySelector('.count-label').textContent = t.worksLabel;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const map = { all: t.all, illustration: t.illustration, digital: t.digital, concept: t.concept, mixed: t.mixed };
    if (map[b.dataset.filter]) b.textContent = map[b.dataset.filter];
  });
  const noteHeading = document.querySelector('.note-heading span');
  if (noteHeading) noteHeading.textContent = t.latestLog;
  const magazineLink = document.querySelector('.note-all-link');
  if (magazineLink) magazineLink.textContent = t.magazineLink;
  const videoHeading = document.querySelector('#page-video .note-heading span');
  if (videoHeading) videoHeading.textContent = t.videoWorks;
}

/* =============================================
   VIDEO TAB GALLERY
   ============================================= */
const videoFiles = [
  'Videos/Hf%2020260309%20025641%20C2ba1331-Ed18-4107-B849-8B04b6019a59.mp4',
  'Videos/Hf%2020260309%20031100%2096159Da7-7Ee8-4D73-A2e4-C412fd127096.mp4',
  'Videos/Hf%2020260315%20045226%201390F80d-94E1-46A7-8Bb9-2Cacbd0496f6.mp4',
  'Videos/Hf%2020260315%20063528%20C1d8d360-3Db7-44F1-8Ac6-90Bb50ac4ad7.mp4',
  'Videos/Hf%2020260317%20025515%207402B4c4-C252-4Bef-8834-497Eb42552eb.mp4',
  'Videos/Hf%2020260317%20134305%20A748f81e-52Fb-49Fc-83C2-D1fff647a1e7.mp4',
  'Videos/Hf%2020260317%20221648%20B6cbfd07-8D36-4318-84E5-4E6fbbbf120d.mp4',
  'Videos/Hf%2020260317%20221719%20013D850e-0094-4797-A14d-032121B28c80.mp4',
  'Videos/Hf%2020260321%20050736%209F3293bf-F618-4Da0-9404-Aa3f7f155eeb.mp4',
  'Videos/Hf%2020260321%20122832%209D8fbcbf-1C70-4D28-96A8-7F298f58ea1d.mp4',
  'Videos/Hf%2020260323%20033446%20632A574d-48A7-469D-8300-6A0a57b8ffb0.mp4',
  'Videos/Hf%2020260323%20084237%208Ce9cf90-Ad67-4F2d-A214-77A8ac03ffcb.mp4',
  'Videos/Hf%2020260324%20104000%20D53cbae1-6986-45Fd-92Ed-3Aa9ba557989.mp4',
  'Videos/Hf%2020260326%20024222%200565A8cc-068E-4027-B2f1-3E71b468b266.mp4',
  'Videos/Hf%2020260328%20062010%202Ac39e3e-4C54-40Da-9946-70C6d90693e4.mp4',
  'Videos/Hf%2020260328%20063500%20C85aac1a-Cf21-473C-8Ce6-603F74fb955e.mp4',
  'Videos/Hf%2020260329%20073746%2036345Fe9-Dfb0-4C62-Ac57-6442B57011e5.mp4',
  'Videos/Hf%2020260330%20110629%20606Eea58-7061-46B1-9Ec2-F43347fea5e1.mp4',
  'Videos/Hf%2020260331%20013213%20Dbc167e1-47F6-412E-Bcc1-4B6020117292.mp4',
  'Videos/Hf%2020260331%20064056%20149Fa77d-973C-45F2-8Ad6-814501D55bae.mp4',
  'Videos/Hf%2020260331%20092600%20B7fe5512-048E-493B-A719-6A181e62c546.mp4',
];

(function buildVideoTab() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  videoFiles.forEach(src => {
    const card = document.createElement('div');
    card.className = 'vgallery-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.innerHTML = `
      <div class="vgallery-thumb">
        <video src="${src}" muted playsinline preload="metadata"></video>
        <div class="play-badge" aria-hidden="true"><div class="play-badge-inner">
          <svg viewBox="0 0 16 16"><polygon points="3,1 15,8 3,15"/></svg>
        </div></div>
      </div>`;
    card.addEventListener('click', () => openVModal(src));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVModal(src); } });
    grid.appendChild(card);
  });
})();

const vmodalOverlay = document.getElementById('vmodalOverlay');
const vmodalClose   = document.getElementById('vmodalClose');
const vmodalPlayer  = document.getElementById('vmodalPlayer');

function openVModal(src) {
  vmodalPlayer.src = src;
  vmodalOverlay.setAttribute('aria-hidden', 'false');
  vmodalOverlay.classList.add('is-open');
  vmodalPlayer.play();
  vmodalClose.focus();
}
function closeVModal() {
  vmodalPlayer.pause();
  vmodalPlayer.src = '';
  vmodalOverlay.setAttribute('aria-hidden', 'true');
  vmodalOverlay.classList.remove('is-open');
}
vmodalClose.addEventListener('click', closeVModal);
vmodalOverlay.addEventListener('click', e => { if (e.target === vmodalOverlay) closeVModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && vmodalOverlay.classList.contains('is-open')) closeVModal(); });