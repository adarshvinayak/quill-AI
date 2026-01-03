import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import BrutalInput from '../ui/BrutalInput';
import BrutalButton from '../ui/BrutalButton';
import BrutalCard from '../ui/BrutalCard';
import { supabase } from '../../lib/supabase';

export default function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [channels, setChannels] = useState<string[]>(['']);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddChannel = () => {
    setChannels([...channels, '']);
  };

  const handleRemoveChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
  };

  const handleChannelChange = (index: number, value: string) => {
    const newChannels = [...channels];
    newChannels[index] = value;
    setChannels(newChannels);
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const filteredChannels = channels.filter(ch => ch.trim() !== '');

    const { error } = await supabase.from('waitlist').insert([
      {
        name: name.trim(),
        email: email.trim(),
        channels: filteredChannels.length > 0 ? filteredChannels : null,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      setErrors({ ...errors, email: 'Something went wrong. Please try again.' });
      return;
    }

    setIsSuccess(true);
    setName('');
    setEmail('');
    setChannels(['']);

    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <BrutalCard className="max-w-2xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-black mb-6 text-center uppercase">
        Join the Waitlist
      </h2>
      <p className="text-center font-bold mb-8 text-lg">
        Be the first to know when we launch. Get early access to powerful comment intelligence.
      </p>

      {isSuccess ? (
        <div className="bg-electricBlue text-white p-6 brutal-border text-center">
          <p className="font-black text-xl">SUCCESS!</p>
          <p className="font-bold mt-2">You're on the list. We'll be in touch soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-black text-sm mb-2 uppercase">
              Name *
            </label>
            <BrutalInput
              value={name}
              onChange={setName}
              placeholder="Your name"
              error={errors.name}
            />
          </div>

          <div>
            <label className="block font-black text-sm mb-2 uppercase">
              Email *
            </label>
            <BrutalInput
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              error={errors.email}
            />
          </div>

          <div>
            <label className="block font-black text-sm mb-2 uppercase">
              Channel/Page URLs (Optional)
            </label>
            <p className="text-sm font-bold mb-4 text-gray-600">
              Add links to your YouTube, Instagram, or X pages
            </p>
            <div className="space-y-3">
              {channels.map((channel, index) => (
                <div key={index} className="flex gap-2">
                  <BrutalInput
                    value={channel}
                    onChange={(value) => handleChannelChange(index, value)}
                    placeholder="https://youtube.com/@channel"
                    className="flex-1"
                  />
                  {channels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChannel(index)}
                      className="brutal-border brutal-shadow bg-white p-3 hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {channels.length < 5 && (
              <button
                type="button"
                onClick={handleAddChannel}
                className="mt-3 flex items-center gap-2 font-bold text-electricBlue hover:text-blue-700"
              >
                <Plus size={20} />
                Add Another Channel
              </button>
            )}
          </div>

          <BrutalButton
            variant="warning"
            size="lg"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'JOINING...' : 'JOIN WAITLIST'}
          </BrutalButton>
        </form>
      )}
    </BrutalCard>
  );
}
