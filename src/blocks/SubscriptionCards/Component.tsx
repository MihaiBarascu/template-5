'use client';

import { Media } from '@/components/Media';
import type { Media as MediaType, Subscription } from '@/payload-types';
import { ArrowRight, Check, Star, X } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionCardsBlockProps {
  variant?:
    | 'cards-3'
    | 'cards-4'
    | 'cards-overlay'
    | 'list-compact'
    | 'table-compare';
  heading?: string;
  subheading?: string;
  showImage?: boolean;
  showFeatures?: boolean;
  showOldPrice?: boolean;
  highlightStyle?: 'border' | 'background' | 'elevated' | 'badge';
  ctaButton?: {
    enabled?: boolean | null;
    label?: string | null;
    link?: string | null;
  } | null;
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary';
  subscriptions: Subscription[];
}

export function SubscriptionCardsBlock({
  variant = 'cards-3',
  heading,
  subheading,
  showImage = false,
  showFeatures = true,
  showOldPrice = true,
  highlightStyle = 'border',
  ctaButton,
  backgroundColor = 'default',
  subscriptions,
}: SubscriptionCardsBlockProps) {
  const bgClasses = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
    primary: 'bg-theme-primary text-white',
  };

  const gridClasses = {
    'cards-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'cards-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'cards-overlay': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'list-compact': 'grid-cols-1',
    'table-compare': 'grid-cols-1',
  };

  const getHighlightClasses = (isHighlighted: boolean) => {
    if (!isHighlighted) return '';
    switch (highlightStyle) {
      case 'border':
        return 'border-2 border-theme-primary';
      case 'background':
        return 'bg-theme-primary text-white';
      case 'elevated':
        return 'scale-105 shadow-xl z-10';
      case 'badge':
        return 'relative';
      default:
        return '';
    }
  };

  if (variant === 'table-compare') {
    return (
      <section className={`py-section ${bgClasses[backgroundColor]}`}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="heading-h2 font-bold mb-4">{heading}</h2>
              )}
              {subheading && (
                <p className="text-theme-text-light max-w-2xl mx-auto">
                  {subheading}
                </p>
              )}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b border-theme-border">
                    Caracteristici
                  </th>
                  {subscriptions.map(sub => (
                    <th
                      key={sub.id}
                      className="p-4 text-center border-b border-theme-border"
                    >
                      <div className="font-bold text-lg">{sub.title}</div>
                      <div className="text-theme-primary heading-h2 font-bold mt-2">
                        {sub.pricing?.amount} {sub.pricing?.currency || 'RON'}
                        <span className="text-sm font-normal text-theme-text-light">
                          {sub.pricing?.period}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Get all unique features */}
                {Array.from(
                  new Set(
                    subscriptions.flatMap(
                      sub => sub.features?.map(f => f.text) || [],
                    ),
                  ),
                ).map((featureText, idx) => (
                  <tr key={idx} className="border-b border-theme-border">
                    <td className="p-4">{featureText}</td>
                    {subscriptions.map(sub => {
                      const feature = sub.features?.find(
                        f => f.text === featureText,
                      );
                      return (
                        <td key={sub.id} className="p-4 text-center">
                          {feature?.included ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : feature ? (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          ) : (
                            <span className="text-theme-text-muted">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-section ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="heading-h2 font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className="text-theme-text-light max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridClasses[variant]} gap-6 items-stretch`}>
          {subscriptions.map(subscription => {
            const image = subscription.image as MediaType | null;
            const isHighlighted = subscription.highlighted;

            if (variant === 'cards-overlay' && showImage) {
              return (
                <div
                  key={subscription.id}
                  className={`relative overflow-hidden rounded-[var(--radius-card)] group ${getHighlightClasses(isHighlighted || false)}`}
                >
                  {image?.url && (
                    <div className="relative aspect-[4/3]">
                      <Media
                        resource={image}
                        fill
                        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        imgClassName="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    {isHighlighted && subscription.highlightLabel && (
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-theme-primary rounded-full mb-3">
                        {subscription.highlightLabel}
                      </span>
                    )}
                    <h3 className="heading-h3 font-bold mb-2">
                      {subscription.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="heading-h2 font-bold">
                        {subscription.pricing?.amount}
                      </span>
                      <span className="text-sm opacity-80">
                        {subscription.pricing?.currency || 'RON'}
                        {subscription.pricing?.period}
                      </span>
                      {showOldPrice && subscription.pricing?.oldPrice && (
                        <span className="line-through text-theme-text-muted text-sm">
                          {subscription.pricing.oldPrice}
                        </span>
                      )}
                    </div>
                    {subscription.cta?.label && (
                      <Link
                        href={
                          subscription.cta.linkType === 'custom'
                            ? subscription.cta.url || '/contact'
                            : '#'
                        }
                        className="btn-secondary bg-white/20 border-white text-white hover:bg-white hover:text-black"
                      >
                        {subscription.cta.label}
                      </Link>
                    )}
                  </div>
                </div>
              );
            }

            if (variant === 'list-compact') {
              return (
                <div
                  key={subscription.id}
                  className={`flex items-center justify-between p-4 bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] ${getHighlightClasses(isHighlighted || false)}`}
                >
                  <div className="flex items-center gap-4">
                    {isHighlighted && (
                      <Star className="w-5 h-5 text-theme-primary fill-current" />
                    )}
                    <div>
                      <h3 className="font-bold">{subscription.title}</h3>
                      {subscription.subtitle && (
                        <span className="text-sm text-theme-text-light">
                          {subscription.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xl font-bold text-theme-primary">
                        {subscription.pricing?.amount}
                      </span>
                      <span className="text-sm text-theme-text-light ml-1">
                        {subscription.pricing?.currency || 'RON'}
                        {subscription.pricing?.period}
                      </span>
                    </div>
                    <Link
                      href={
                        subscription.cta?.linkType === 'custom'
                          ? subscription.cta?.url || '/contact'
                          : '#'
                      }
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      {subscription.cta?.label || 'Alege'}
                    </Link>
                  </div>
                </div>
              );
            }

            // Default cards
            return (
              <div
                key={subscription.id}
                className={`flex flex-col bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] ${getHighlightClasses(isHighlighted || false)}`}
              >
                {/* Highlight label */}
                {isHighlighted &&
                  highlightStyle === 'badge' &&
                  subscription.highlightLabel && (
                    <div className="bg-theme-primary text-white text-center py-2 text-sm font-bold">
                      {subscription.highlightLabel}
                    </div>
                  )}

                {showImage && image?.url && (
                  <div className="relative aspect-video">
                    <Media
                      resource={image}
                      fill
                      size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imgClassName="object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="heading-h3 font-bold mb-1">
                      {subscription.title}
                    </h3>
                    {subscription.subtitle && (
                      <p className="text-theme-text-light text-sm">
                        {subscription.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-theme-primary">
                        {subscription.pricing?.amount}
                      </span>
                      <span className="text-theme-text-light">
                        {subscription.pricing?.currency || 'RON'}
                      </span>
                    </div>
                    <span className="text-sm text-theme-text-light">
                      {subscription.pricing?.period}
                    </span>
                    {showOldPrice && subscription.pricing?.oldPrice && (
                      <div className="mt-1">
                        <span className="line-through text-theme-text-muted">
                          {subscription.pricing.oldPrice} RON
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {showFeatures &&
                    subscription.features &&
                    subscription.features.length > 0 && (
                      <ul className="space-y-3 mb-6 flex-1">
                        {subscription.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {feature.included ? (
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-theme-text-muted flex-shrink-0 mt-0.5" />
                            )}
                            <span
                              className={
                                feature.included ? '' : 'text-theme-text-muted'
                              }
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                  {/* CTA */}
                  {subscription.cta?.label && (
                    <Link
                      href={
                        subscription.cta.linkType === 'custom'
                          ? subscription.cta.url || '/contact'
                          : '#'
                      }
                      className={`w-full text-center ${isHighlighted ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {subscription.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.link && (
          <div className="text-center mt-10">
            <Link
              href={ctaButton.link}
              className="btn-primary inline-flex items-center gap-2"
            >
              {ctaButton.label || 'Vezi toate abonamentele'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default SubscriptionCardsBlock;
