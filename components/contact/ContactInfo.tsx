import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoProps {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
  description: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  title,
  address,
  phone,
  email,
  description
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {address && (
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-gray-600">{address}</p>
        </div>
      )}
      
      {phone && (
        <div className="flex items-center mb-3">
          <Phone className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-600">{phone}</p>
        </div>
      )}
      
      {email && (
        <div className="flex items-center mb-4">
          <Mail className="h-5 w-5 text-gray-500 mr-2" />
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
            {email}
          </a>
        </div>
      )}
      
      <p className="text-gray-600 mt-4">{description}</p>
    </div>
  );
};

export default ContactInfo;
