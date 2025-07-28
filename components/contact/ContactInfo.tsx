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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg h-full shadow-sm dark:shadow-gray-700/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      
      {address && (
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-gray-600 dark:text-gray-300">{address}</p>
        </div>
      )}
      
      {phone && (
        <div className="flex items-center mb-3">
          <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <p className="text-gray-600 dark:text-gray-300">{phone}</p>
        </div>
      )}
      
      {email && (
        <div className="flex items-center mb-4">
          <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
            {email}
          </a>
        </div>
      )}
      
      <p className="text-gray-600 dark:text-gray-300 mt-4">{description}</p>
    </div>
  );
};

export default ContactInfo;
