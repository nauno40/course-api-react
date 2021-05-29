<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Controller\InvoiceIncrementationController;
use App\Repository\InvoiceRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 */
#[ApiResource(
    itemOperations: ['GET', 'PUT', 'DELETE',
    'increment' => [
        'method' => 'POST',
        'path' => '/factures/{id}/increment',
        'controller' => InvoiceIncrementationController::class,
        'openapi_context' => [
            'summary' => 'Incrémente une facture',
            'description' => 'Incrémente une facture donnée',
            'requestBody' => [
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                        ]
                    ]
                ]
            ]
        ]
    ]],
    subresourceOperations: [
    'api_customers_invoices_get_subresource' => [
        "normalization_context" => ["groups" => "invoice_subresource"]
    ]],
    attributes: ["pagination_enabled" => false, "order" => ['sentAt' => 'desc']],
    denormalizationContext: ['disable_type_enforcement'=> true],
    normalizationContext: ["groups" => "invoice_visibility"]
)]
#[ApiFilter(OrderFilter::class, properties: ["amount", "sentAt"])]
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(["invoice_visibility", "customers_visibility", "invoice_subresource"])]
    private ?int $id;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être numérique")
     */
    #[Groups(["invoice_visibility", "customers_visibility", "invoice_subresource"])]
    private ?float $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\Type(type="DateTime", message="La date doit être au format YYYY-MM-DD")
     * @Assert\NotBlank(message="la date d'envoi doit être renseignéée")
     *
     */
    #[Groups(["invoice_visibility", "customers_visibility", "invoice_subresource"])]
    private ?DateTimeInterface $sentAt = null;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELED"}, message="Le statut doit être SENT, PAID ou CANCELED")
     */
    #[Groups(["invoice_visibility", "customers_visibility", "invoice_subresource"])]
    private ?string $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné")
     */
    #[Groups(["invoice_visibility"])]
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="Le chrono doit être renseigné")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    #[Groups(["invoice_visibility", "customers_visibility", "invoice_subresource"])]
    private ?int $chrono;

    /**
     * @return User
     */
    #[Groups(["invoice_visibility"])]
    public function getUser() : User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
