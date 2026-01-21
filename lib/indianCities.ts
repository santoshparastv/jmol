/**
 * Comprehensive list of Indian cities
 * Used for autocomplete in Location (City) field
 * Includes major cities, state capitals, and district headquarters
 */
export const INDIAN_CITIES = [
  // Major metropolitan cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar', 'Prayagraj',
  'Howrah', 'Ranchi', 'Jabalpur', 'Gwalior', 'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Dharwad', 'Bareilly', 'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh',
  'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi',
  'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
  'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola',
  'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad',
  'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala',
  'Tirupur', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Rajahmundry', 'Bokaro', 'South Dumdum',
  'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara', 'Panihati', 'Latur',
  'Dhule', 'Rohtak', 'Korba', 'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam', 'Avadi',
  'Kadapa', 'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur', 'Shivamogga',
  'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam',
  'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Tinsukia',
  'Jalna', 'Ambarnath', 'Fatehpur', 'Sangareddy', 'Ratlam', 'Handwara', 'Unnao', 'Munger', 'Burhanpur', 'Hapur',
  'Rewa', 'Tenali', 'Sitapur', 'Gondia', 'Raichur', 'Bhiwani', 'Bidar', 'Hindupur', 'Nalgonda', 'Chittoor',
  'Bettiah', 'Bhusawal', 'Basirhat', 'Baidyabati', 'Marmagao', 'Raebareli', 'Jalpaiguri', 'Bhimavaram', 'Karaikudi',
  'Kishanganj', 'Karaikal', 'Hazaribagh', 'Hajipur', 'Gangtok', 'Dibrugarh', 'Bidhan Nagar', 'Dindigul', 'Naihati',
  'Bagaha', 'Yamunanagar', 'Medinipur', 'Bongaigaon', 'Purnia', 'Palakkad', 'Anand', 'Fatehpur Sikri', 'Raiganj',
  'Chinsurah', 'Machilipatnam', 'Madhyamgram', 'Barshi', 'Mothihari', 'Orai', 'Bhadravati', 'Giridih', 'Hoshiarpur',
  'Tadepalligudem', 'Ongole', 'Nandurbar', 'Morena', 'Bhiwadi', 'Porbandar', 'Palwal', 'Anakapalle', 'Narasaraopet',
  'Nadiad', 'Yavatmal', 'Barnala', 'Nagaon', 'Narasapuram', 'Ramanagaram', 'Udgir', 'Tuni', 'Lalitpur', 'Bhadrak',
  'Karur', 'Kothagudem', 'Kumbakonam', 'Bhimtal', 'Kaithal', 'Nagapattinam', 'Buxar', 'Tezpur', 'Baripada',
  'Jagdalpur', 'Motihari', 'Phagwara', 'Pudukkottai', 'Sasaram', 'Gudivada', 'Muktsar', 'Robertsganj', 'Suryapet',
  'Siwan', 'Tadpatri', 'Bargarh', 'Nandyal', 'Banswara', 'Titagarh', 'Lakhisarai', 'Vizianagaram',
  'Karauli', 'Mandi', 'Guntakal', 'Chitradurga', 'Khandwa', 'Purulia', 'Madikeri', 'Srikakulam', 'Mirzapur',
  'Bhadrachalam', 'Chikkaballapur', 'Mandya', 'Hassan', 'Sivaganga', 'Palanpur', 'Gangavathi', 'Bagalkot',
  'Koppal', 'Gadag-Betageri', 'Karwar', 'Sirsi', 'Mudhol', 'Badami', 'Aihole', 'Pattadakal', 'Hampi',
  'Shimoga', 'Tumkur', 'Kolar', 'Ramanagara', 'Chamrajnagar', 'Kodagu', 'Dakshina Kannada', 'Udupi',
  'Chikkamagaluru', 'Davangere', 'Haveri', 'Gadag', 'Vijayapura', 'Kalaburagi', 'Yadgir', 'Ballari',
  'Vijayanagara', 'Belagavi', 'Uttara Kannada', 'Tumakuru', 'Chikkaballapura', 'Chamarajanagara',
  // Additional major cities
  'Aurangabad', 'Navi Mumbai', 'Kalyan', 'Vasai-Virar', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur',
  'Palakkad', 'Kollam', 'Alappuzha', 'Kannur', 'Kottayam', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Kasaragod',
  'Malappuram', 'Ernakulam', 'Thrissur', 'Palakkad', 'Kollam', 'Alappuzha', 'Kannur', 'Kottayam',
  // More cities from various states
  'Guntur', 'Vijayawada', 'Visakhapatnam', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa', 'Anantapur',
  'Eluru', 'Ongole', 'Machilipatnam', 'Tenali', 'Chittoor', 'Hindupur', 'Nandyal', 'Adoni', 'Madanapalle',
  'Guntakal', 'Dharmavaram', 'Gudivada', 'Srikakulam', 'Narasaraopet', 'Proddatur', 'Tadepalligudem',
  'Chilakaluripet', 'Ponnur', 'Vinukonda', 'Narasapuram', 'Palakollu', 'Bhimavaram', 'Tanuku', 'Rayadurg',
  'Adilabad', 'Nizamabad', 'Karimnagar', 'Warangal', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Sangareddy',
  'Miryalaguda', 'Narayanpet', 'Jagtial', 'Mancherial', 'Peddapalli', 'Kamareddy', 'Siddipet', 'Wanaparthy',
  'Nagarkurnool', 'Yadadri Bhuvanagiri', 'Jangaon', 'Bhongir', 'Vikarabad', 'Medak', 'Zaheerabad',
  // Continue with more cities...
].sort()
