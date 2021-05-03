<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 */
#[ApiResource(
    collectionOperations: ['GET' , 'POST'],
    itemOperations: ['GET', 'PUT', 'DELETE'],
    normalizationContext: ["groups" => "customers_visibility"]
)]
#[ApiFilter(SearchFilter::class, strategy: "partial",)]
#[ApiFilter(OrderFilter::class)]
class Customer
{

    const STATUS_PAID = 'PAID';
    const STATUS_CANCELLED = 'CANCELLED';
    const STATUS_SENT = 'SENT';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["customers_visibility", "invoice_visibility"])]
    private ?int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["customers_visibility", "invoice_visibility"])]
    private ?string $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["customers_visibility", "invoice_visibility"])]
    private ?string $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["customers_visibility", "invoice_visibility"])]
    private ?string $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    #[Groups(["customers_visibility", "invoice_visibility"])]
    private ?string $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     */
    #[Groups(["customers_visibility"])]
    #[ApiSubresource]
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     */
    #[Groups(["customers_visibility"])]
    private ?User $user;

    #[Pure] public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de récupérer le total des Invoices
     * @return float
     */
    #[Groups(["customers_visibility"])]
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Permet de récupérer le montant total non payé ou annulé
     * @return float
     */
    #[Groups(["customers_visibility"])]
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === self::STATUS_PAID
                || $invoice->getStatus() === self::STATUS_CANCELLED) ? 0 : $invoice->getAmount();
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
